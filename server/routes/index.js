const express = require('express')
const router = express.Router()
const screenshot = require('./screenshot')
// const download = require('./download')

// router.post('/download', download);
router.post('/screenshot', screenshot)

module.exports = router
