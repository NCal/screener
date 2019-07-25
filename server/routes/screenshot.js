const ENV = require('../../env')
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const { Router } = require('express')
const router = Router()
const puppeteer = require('puppeteer')
const waitOn = require('wait-on')
const pBar = require('../helper/pBar')
const uniqid = require('uniqid')
let s3
let envVar
if (process.env.NODE_ENV !== 'production') {
  envVar = 'dev'
  const LOCALENV = require('../../localEnv')
  s3 = new AWS.S3({
    accessKeyId: LOCALENV.accessKeyId,
    secretAccessKey: LOCALENV.secretAccessKey
  })
} else {
  envVar = 'production'
  s3 = new AWS.S3({
    accessKeyId: ENV.accessKeyId,
    secretAccessKey: ENV.secretAccessKey
  })
}

const uploadFile = function (fileName, photoName, fileOption) {
  return new Promise((resolve, reject) => {
    console.log(fileName, photoName)
    fs.readFile(fileName, (err, data) => {
      console.log('fs.readFILE!!!!', fileName, fileOption)
      if (err) { console.log('❌error reading upload file !❌'); reject(err) }
      let params
      if (fileOption !== 'jpeg') {
        params = {
          Bucket: 'screensh',
          Key: `photos/${photoName}.pdf`,
          ContentType: 'application/pdf',
          ACL: 'public-read-write',
          Body: data
        }
      } else {
        params = {
          Bucket: 'screensh',
          Key: `photos/${photoName}.jpeg`,
          ContentType: 'image/jpeg',
          ACL: 'public-read-write',
          Body: data
        }
      }

      s3.upload(params, function (s3Err, data) {
        console.log('⚠️ s3 upload', data)
        if (s3Err) { console.log('❌s3 upload error!❌'); reject(s3Err) } else {
          console.log(`File uploaded successfully at ${data.Location}`)
          resolve(`File uploaded successfully at ${data.Location}`)
        }
      })
    })
  })
}

let screenshot = async function (url, photoName, fileURL, fullPage, fileOption) {
  return new Promise(async (resolve, reject) => {
    console.log('🍑 Screenshot url 🍑', JSON.stringify(url))
    pBar.bar.tick()
    let browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
      slowMo: 250 // slow down by 250ms
    })

    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36')
    await page.setJavaScriptEnabled(true)
    await page.setViewport({ width: 1920, height: 1080 })

    await page.goto(url, {waitUntil: 'networkidle0'})
      .then(() => { console.log('✅success finding url✅') })
      .catch((err) => { console.log('❌error navigating to page❌', err); reject(err) })
    if (fileOption !== 'jpeg') {
      // PDF
      await page.pdf({ path: fileURL }).then((image) => {
        console.log('PDF', image)
      }).catch((err) => {
        console.log('❌error taking PDF❌', err)
        reject(err)
      })
    } else {
      // JPEG
      await page.screenshot({ path: fileURL, fullPage: fullPage, type: fileOption, quality: 75 }).then((image) => {
        console.log('✅image', image)
      }).catch((err) => {
        console.log('❌error taking screeenshot❌', err)
        reject(err)
      })
    }

    // await fullPageScreenshot.default(page, {path: path.join(__dirname, '../public/screenshot.png')})
    console.log('after screenshot')
    pBar.bar.tick()
    await browser.close()
    resolve(photoName)
  })
}

let deleteFile = function (fileName, fileOption) {
  console.log('delete file path', fileName)
  return new Promise((resolve, reject) => {
    fs.unlink(fileName, (err) => {
      if (err) { console.log('❌we have an error deleting the file❌'); reject(err) }
      console.log('✅screenshot was deleted')
      pBar.bar.tick(2)
      resolve('screenshot was deleted')
    })
  })
}

let checkExistsWithTimeout = function (filePath, timeout) {
  return new Promise(function (resolve, reject) {
    let timer = setTimeout(function () {
      watcher.close()
      reject(new Error('File did not exists and was not created during the timeout.'))
    }, timeout)

    fs.access(filePath, fs.constants.R_OK, function (err) {
      if (!err) {
        pBar.bar.tick(2)
        clearTimeout(timer)
        watcher.close()
        console.log('✅local file found!✅')
        resolve()
      } else {
        console.log('❌error accessing local file!❌')
        reject(err)
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

let queryBucket = function (photoName, fileOption) {
  console.log('QUERY BUCKET⚠️')
  return new Promise((resolve, reject) => {
    let opts

    if (fileOption !== 'jpeg') {
      opts = {
        resources: [
          `https://screensh.s3.amazonaws.com/photos/${photoName}.pdf`
        ],
        delay: 0, // initial delay in ms, default 0
        interval: 250, // poll interval in ms, default 250ms
        timeout: 100000, // timeout in ms, default Infinity
        tcpTimeout: 1000, // tcp timeout in ms, default 300ms
        window: 1000 // stabilization time in ms, default 750ms
      }
    } else {
      opts = {
        resources: [
          `https://screensh.s3.amazonaws.com/photos/${photoName}.jpeg`
        ],
        delay: 0, // initial delay in ms, default 0
        interval: 250, // poll interval in ms, default 250ms
        timeout: 100000, // timeout in ms, default Infinity
        tcpTimeout: 1000, // tcp timeout in ms, default 300ms
        window: 1000 // stabilization time in ms, default 750ms
      }
    }

    // Usage with promises
    waitOn(opts)
      .then(function () {
        // once here, all resources are available
        pBar.bar.tick(2)
        console.log('✅link should be working now, safe to delete file')
        resolve(photoName)
      })
      .catch(function (err) {
        console.log('❌ ERROR querying bucket')
        reject(err)
      })
  })
}

router.post('/screenshot', async (req, res, next) => {
  // console.log('❇️req❇️', req);
  // console.log('⚠️res⚠️', res);
  console.log('❇️req❇️', req.body.url, req.body.fileOption, req.body.fullPage)
  let fullPage = req.body.fullPage
  let fileOption = req.body.fileOption.toLowerCase()
  console.log('fileoption', fileOption)
  let photoName = uniqid('screenshot-')
  let fileName
  if (fileOption !== 'jpeg') {
    // PDF
    fileName = path.join(__dirname, `/${photoName}.pdf`)
  } else {
    // JPG
    fileName = path.join(__dirname, `/${photoName}.jpeg`)
  }

  await screenshot(req.body.url, photoName, fileName, fullPage, fileOption).then(() => {
    console.log('time to check if file exists')
    checkExistsWithTimeout(fileName, 10000)
      .then(() => {
        // upload file to s3
        uploadFile(fileName, photoName, fileOption).then(() => {
          // query bucket
          queryBucket(photoName, fileOption).then(() => {
            // delete local file
            deleteFile(fileName, fileOption).then(() => {
              console.log('sending success response')
              pBar.bar.tick(2)
              res.json({ success: true, fileType: fileOption, photoName: photoName })
            }).catch(() => {
              console.log(' delete file error')
              res.json({
                success: false,
                photoName: null,
                error: 'delete file error'
              })
            })
          }).catch(() => {
            console.log('query bucket file error')
            res.json({
              success: false,
              photoName: null,
              error: 'query bucket file error'
            })
          })
        }).catch(() => {
          console.log('upload file error')
          res.json({
            success: false,
            photoName: null,
            error: 'upload file error'
          })
        })
      }).catch(() => {
        console.log('check exists with timeout error')
        res.json({
          success: false,
          photoName: null,
          error: 'check exists with timeout error'
        })
      })
  }).catch((err) => {
    err = err || '🆘'
    res.json({
      success: false,
      photoName: null,
      error: 'screenshot error'
    })
  })
})

module.exports = router
