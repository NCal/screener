const { Pool } = require('pg')
const dbConfig = require('./db_config')
const pool = new Pool(dbConfig)

module.exports = pool
