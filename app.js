const express = require('express')
const app = express()
const path = require('path')

module.exports = params => {
  app.use(express.static(__dirname + '/dist'))

  app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/dist/index.html'))
  })
  
  app.get('/second', (req,res) => {
    res.sendFile(path.join(__dirname + '/dist/second.html'))
  })
  
  app.listen(process.env.PORT || 3000)
  
  console.log('Listening on', process.env.PORT || 3000)
}
