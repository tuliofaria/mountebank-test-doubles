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
    stubs: [
      {
        predicates: [
          {
            deepEquals: {
              method: 'GET'
            }
          },
          {
            deepEquals: {
              path: '/uuid'
            }
          }
        ],
        responses: [
          {
            is: {
              statusCode: 200,
              headers: {
                Date: 'Sat, 30 Jan 2021 21:26:56 GMT',
                'Content-Type': 'application/json',
                'Content-Length': '53',
                Connection: 'close',
                Server: 'gunicorn/19.9.0',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
              },
              body: '{\n  "uuid": "95ff169c-2688-4ab6-bb92-bfb1a8d3f375"\n}\n',
              _mode: 'text',
              _proxyResponseTime: 559
            },
            behaviors: [
              {
                wait: 559
              }
            ]
          }
        ]
      }
    ]
  })
  console.log('imposter created')
}
run()
