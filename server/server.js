// PACKAGES //
const path = require('path')
const fs = require('fs')
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const urlParse = require('url-parse')
const session = require('express-session')
const download = require('./routes/download.js')

// IMPORTS //
const indexRoutes = require('./routes/index')
const shorten = require('./routes/shorten')

// CREATE APP //
const app = express()

// VIEW ENGINE //
app.set('view engine', 'html')
app.engine('html', function (path, options, callback) {
  fs.readFile(path, 'utf-8', callback)
})
app.set('json spaces', 0)

// MIDDLEWARE //
app.use(express.static(path.join(__dirname, '../client')))
app.use(logger('dev'))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(bodyParser.json())
app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/download', download)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'))
})

// ROUTES //
app.use('/', indexRoutes)

// ERROR HANDLER //
app.use(function (err, req, res, next) {
  console.log(err.stack)
  res.status(err.status || 500).send('something broke')
})

var port = process.env.PORT || 3000
var server = app.listen(port, function () {
  console.log('running at localhost:' + port)
})
