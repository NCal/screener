const express = require('express')
const router = express.Router()
const screenshot = require('./screenshot')
const download = require('./download')

router.post('/screenshot', screenshot)
router.post('/download', download)

module.exports = router
