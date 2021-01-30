const express = require('express')

const createServer = (mode) => {
  const app = express()
  const axios = require('axios')

  const dev = mode === 'dev'
  app.get('/', async (req, res) => {
    const url = dev ? 'http://localhost:10000' : 'https://httpbin.org'
    const data = await axios.get(url + '/uuid')
    console.log('request received on server')
    res.send(data.data)
  })
  return app
}
module.exports = createServer
