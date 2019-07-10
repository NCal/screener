const { Router } = require('express')
const pool = require('../../Data/index')
const router = Router()
const uniqid = require('uniqid')
const puppeteer = require('puppeteer')
const fullPageScreenshot = require('puppeteer-full-page-screenshot')

let screenshot = async function (url) {
  let browser = await puppeteer.launch({
    headless: false
    // slowMo: 250 // slow down by 250ms
  })

  const page = await browser.newPage()
  console.log('url 🍑', JSON.stringify(url))
  let pageUrl = url
  await page.goto(pageUrl)
  page.setViewport({ width: 1920, height: 1080 })

  await page.screenshot({ path: `screenshot.png` });
  // await fullPageScreenshot.default(page, { path: 'screenshot.png' });
  await browser.close()
}

router.post('/screenshot', (req, res, next) => {
  screenshot(req.body.url)
  res.json({success: true})
})

module.exports = router
