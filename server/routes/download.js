const { Router } = require('express');
const pool = require('../../Data/index');
const router = Router();
const uniqid = require('uniqid');
const puppeteer = require('puppeteer');
const fullPageScreenshot = require('puppeteer-full-page-screenshot');

router.post('/download', (req, res, next) => {
  res.download(`./screenshot.png`, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
      console.log('errrr', err)
    } else {
      console.log('success! ✅')
      // res.json({ success: true })
    }
  })
})

module.exports = router;
