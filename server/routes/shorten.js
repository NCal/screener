#!/usr/bin/env nodejs
const { Router } = require('express')
const pool = require('../../Data/index')
const router = Router()
const uniqid = require('uniqid')

router.post('/shorten', (req, res, next) => {
  console.log('posting links', req.body)
  const { link } = req.body
  const tag = uniqid.time()
  console.log('url', link)

  pool.query(
    `INSERT INTO links(url, tag) VALUES($1, $2)`,
    [link, tag],
    (err, response) => {
      if (err) return next(err)
      console.log('inserting')
      pool.query('SELECT * FROM links ORDER BY id ASC', (err, fromdb) => {
        if (err) return next(err)
        console.log('from db', fromdb.rows)
        res.json(fromdb.rows)
      })
    }
  )
})

module.exports = router
