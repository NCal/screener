const express = require('express')
const router = express.Router()
const path = require('path');

router.post('/download', (req, res, next) => {
  console.log('getting download')
  // res.json({fuck: 'you'})


  res.download(path.join(__dirname, '../../screenshot.png'), 'screenshot.png', (err) => {
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

module.exports = router
