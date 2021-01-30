const mb = require('mountebank')
const axios = require('axios')

const mbServer = mb.create({
  port: 2525,
  pidfile: './mb.pid',
  logfile: './mb.log',
  protofile: './protofile.json',
  ipWhitelist: ['*']
})

const run = async () => {
  await mbServer
  console.log('mountebank running')

  await axios.post('http://localhost:2525/imposters', {
    port: 10000,
    protocol: 'http',
    recordRequest: true,
    stubs: [
      {
        responses: [
          {
            proxy: {
              to: 'https://httpbin.org',
              mode: 'proxyAlways',
              addWaitBehavior: true,
              predicateGenerators: [
                {
                  matches: {
                    method: true,
                    path: true
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  })
  console.log('imposter created')
}
run()
