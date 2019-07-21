const express = require('express')
const router = express.Router()
const screenshot = require('./screenshot')
const download = require('./download')
const rateLimit = require('express-rate-limit')
const limitOptions = {
  windowMs: 60 * 60 * 1000, // Hour
  // windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 100 requests per windowMs
  message: 'Too many reqs, please try again Later',
  handler: function handler (req, res, next) {
    console.log('🎉🎉Limit handler🎉🎉🎉')
    res.json({limitError: this.message})
  }
}
const limiter = rateLimit(limitOptions)

router.post('/screenshot', limiter, screenshot)
// router.post('/download', download)

module.exports = router
