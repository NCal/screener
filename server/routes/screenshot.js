const { Router } = require('express')
const pool = require('../../Data/index')
const router = Router()
const uniqid = require('uniqid')
const puppeteer = require('puppeteer')
const fullPageScreenshot = require('puppeteer-full-page-screenshot')
const path = require('path')
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

router.post('/screenshot', async (req, res, next) => {
  await screenshot(req.body.url)
  await res.json({success: true})
})

module.exports = router
