const app = require('./server')('production')

app.listen(3000, () => {
  console.log('server is running!')
})
