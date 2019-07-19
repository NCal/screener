const { Router } = require('express')
const pool = require('../../Data/index')
const router = Router()
const uniqid = require('uniqid')
const puppeteer = require('puppeteer')
const fullPageScreenshot = require('puppeteer-full-page-screenshot')
const fs = require('fs')
const AWS = require('aws-sdk')
const hidden = require('../../hidden')
const waitOn = require('wait-on')
const ProgressBar = require('progress');

let bar = new ProgressBar('📽🤳📸🎥Performing Screenshot [:bar] :percent :etas 📽🤳📸🎥', {
  complete: '=',
  incomplete: ' ',
  width: 20,
  total: 10
});

let timer = setInterval(function () {
  if (bar.complete) {
    console.log('\ncomplete\n');
    clearInterval(timer);
  }
}, 100);

const s3 = new AWS.S3({
  accessKeyId: hidden.accessKeyId,
  secretAccessKey: hidden.secretAccessKey
})
const path = require('path')

let file = path.join(__dirname, '../public/screenshot.jpeg')

const uploadFile = async function (fileName, photoName) {
  return new Promise((resolve, reject) => {
    console.log('uploading file')
    fs.readFile(fileName, (err, data) => {
      if (err) throw err
      const params = {
        Bucket: 'screensh',
        Key: `photos/${photoName}.jpeg`,
        ContentType: 'image/jpeg',
        ACL: 'public-read-write',
        Body: data
      }
      s3.upload(params, function (s3Err, data) {
        if (s3Err) { reject(s3Err) }
        console.log(data);
        console.log(`File uploaded successfully at ${data.Location}`)
        resolve(`File uploaded successfully at ${data.Location}`)
      })
    })
  })
}

// var promise = new Promise(function (resolve, reject) {
//   // do a thing, possibly async, then…

//   if (/* everything turned out fine */) {
//     resolve("Stuff worked!");
//   }
//   else {
//     reject(Error("It broke"));
//   }
// });

// uploadFile(file);

let screenshot = async function (url) {
  bar.tick()
  let browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
    ignoreHTTPSErrors: true,
    slowMo: 250 // slow down by 250ms
  })

  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36')
  await page.setJavaScriptEnabled(true)
  console.log('🍑 Screenshot url 🍑', JSON.stringify(url))
  await page.setViewport({ width: 1920, height: 1080 })
  await page.goto(url)

  await page.screenshot({ path: path.join(__dirname, '../public/screenshot.jpeg'), fullPage: true, type: 'jpeg', quality: 75 }).then((image) => {
    console.log('✅image', image)
  }).catch((err) => {
    throw new Error(err);
  })
  // await fullPageScreenshot.default(page, {path: path.join(__dirname, '../public/screenshot.png')})
  console.log('after screenshot')
  bar.tick()
  await browser.close()
}

let deleteFile = async function () {
  return new Promise((resolve, reject) => {
    fs.unlink(path.join(__dirname, '../public/screenshot.jpeg'), (err) => {
      if (err) reject(err)
      console.log('screenshot was deleted');
      bar.tick(2)
      resolve('screenshot was deleted')
    })
  })
}

let checkExistsWithTimeout = async function (filePath, timeout) {
  return new Promise(function (resolve, reject) {
    let timer = setTimeout(function () {
      watcher.close()
      reject(new Error('File did not exists and was not created during the timeout.'))
    }, timeout)

    fs.access(filePath, fs.constants.R_OK, function (err) {
      if (!err) {
        bar.tick(2)
        clearTimeout(timer)
        watcher.close()
        resolve()
      }
    })

    let dir = path.dirname(filePath)
    let basename = path.basename(filePath)
    let watcher = fs.watch(dir, function (eventType, filename) {
      if (eventType === 'rename' && filename === basename) {
        console.log('eventType', eventType, 'filename', filename)
        clearTimeout(timer)
        watcher.close()
        resolve()
      }
    })
  })
}

let queryBucket = async function (photoName, callback) {
  return new Promise((resolve, reject) => {
    let opts = {
      resources: [
        `https://screensh.s3.amazonaws.com/photos/${photoName}.jpeg`
      ],
      delay: 1000, // initial delay in ms, default 0
      interval: 100, // poll interval in ms, default 250ms
      timeout: 100000, // timeout in ms, default Infinity
      tcpTimeout: 1000, // tcp timeout in ms, default 300ms
      window: 1000 // stabilization time in ms, default 750ms
    }

    // Usage with promises
    waitOn(opts)
      .then(function () {
        // once here, all resources are available
        bar.tick(2)
        console.log('link should be working now, safe to delete file')
        resolve('link should be working now, safe to delete file')
      })
      .catch(function (err) {
        reject(err);
      })
  })
}

router.post('/screenshot', async (req, res, next) => {
  let photoName = `screenshot-${Date.now()}`

  await screenshot(req.body.url)
  await checkExistsWithTimeout(path.join(__dirname, '../public/screenshot.jpeg'), 10000)
  await uploadFile(file, photoName).then(() => {
    queryBucket(photoName).then(() => {
      deleteFile().then(() => {
        console.log('sending success response')
        bar.tick(2)
        res.json({ success: true, photoName: photoName })
      })
    })
  }).catch((err) => {
    console.log('shit')
    next(err)
  })
})

module.exports = router
