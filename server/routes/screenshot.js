const { Router } = require('express')
const pool = require('../../Data/index')
const router = Router()
const uniqid = require('uniqid')
const puppeteer = require('puppeteer')
const fullPageScreenshot = require('puppeteer-full-page-screenshot')
const fs = require('fs')
const AWS = require('aws-sdk')
const hidden = require('../../hidden')

const s3 = new AWS.S3({
  accessKeyId: hidden.accessKeyId,
  secretAccessKey: hidden.secretAccessKey
})
const path = require('path')

let file = path.join(__dirname, '../public/screenshot.png')

const uploadFile = async function (fileName, photoName) {
  console.log('uploading file')
  fs.readFile(fileName, (err, data) => {
    if (err) throw err
    const params = {
      Bucket: 'screensh',
      Key: `photos/${photoName}.png`,
      ContentType: 'image/png',
      ACL: 'public-read-write',
      Body: data
    }
    s3.upload(params, function (s3Err, data) {
      if (s3Err) throw s3Err
      console.log(`File uploaded successfully at ${data.Location}`)
    })
  })
}

// uploadFile(file);

let screenshot = async function (url) {
  let browser = await puppeteer.launch({
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

  // await page.screenshot({ path: `screenshot.png` })
  await fullPageScreenshot.default(page, {path: path.join(__dirname, '../public/screenshot.png')}, () => {
    console.log('screenshot over')
  })
  console.log('after screenshot')
  await browser.close()
}

let deleteFile = async function () {
  fs.unlink(path.join(__dirname, '../public/screenshot.png'), (err) => {
    if (err) throw err
    console.log('screenshot was deleted')
  })
}

let checkExistsWithTimeout = async function (filePath, timeout) {
  return new Promise(function (resolve, reject) {

    let timer = setTimeout(function () {
      watcher.close();
      reject(new Error('File did not exists and was not created during the timeout.'));
    }, timeout);

    fs.access(filePath, fs.constants.R_OK, function (err) {
      if (!err) {
        clearTimeout(timer);
        watcher.close();
        resolve();
      }
    });

    let dir = path.dirname(filePath);
    let basename = path.basename(filePath);
    let watcher = fs.watch(dir, function (eventType, filename) {
      if (eventType === 'rename' && filename === basename) {
        clearTimeout(timer);
        watcher.close();
        resolve();
      }
    });
  });
}

router.post('/screenshot', async (req, res, next) => {
  let photoName = `screenshot-${Date.now()}`

  await screenshot(req.body.url)
  await checkExistsWithTimeout(path.join(__dirname, '../public/screenshot.png'), 10000)
  await uploadFile(file, photoName)
  await deleteFile()
  await res.json({ success: true, photoName: photoName })
})

module.exports = router
