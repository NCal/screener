const dbConfig = {
  // user: 'fznbpektgxctkc',
  // host: 'ec2-174-129-41-64.compute-1.amazonaws.com',
  // database: 'du09uufkkjqds',
  // port: 5432,
  connectionString: process.env.DATABASE_URL,
  ssl: true
}
// DATABASE_URL=$(heroku config:get DATABASE_URL -a your-app) your_process

module.exports = dbConfig
 