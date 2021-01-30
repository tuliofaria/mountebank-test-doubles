const supertest = require('supertest')
const mb = require('mountebank')
const axios = require('axios')

const app = require('../server')('dev')

const setupUUIDReqeuest = async () => {
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
              body: '{\n  "uuid": "uuid-genereated-online"\n}\n',
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
}

describe('server test', () => {
  let mbServer = null
  beforeAll(async () => {
    mbServer = mb.create({
      port: 2525,
      pidfile: './mb.pid',
      logfile: './mb.log',
      protofile: './protofile.json',
      ipWhitelist: ['*']
    })
    await mbServer
    await setupUUIDReqeuest()
  })
  it('should do something', async () => {
    const result = await supertest(app).get('/')
    expect(result.status).toBe(200)
    expect(result.body.uuid).toMatch('uuid-genereated-online')
  })
})
