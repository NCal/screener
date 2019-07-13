const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

router.get('/download', (req, res, next) => {
  console.log('getting download', req)
  res.download(path.join(__dirname, '../../screenshot.png'), `screenshot.png`, (err) => {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
      console.log('errrr', err)
    } else {
      console.log('success! ✅')
      // res.json({ success: true })
      // fs.unlink(path.join(__dirname, '../../screenshot.png'), (err) => {
      //   if (err) throw err
      //   console.log('path/file.txt was deleted')
      // })
    }
  })
})

module.exports = router
