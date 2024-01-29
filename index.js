const { Server } = require('socket.io')
const http = require('http')
const path = require('path')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { ttsConnection, listenMessage } = require('./mqtt')
const { dbConnection } = require('./database/config')
const { recordsGet } = require('./controllers/cows.controllers')

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

app.use(cors({
  origin: (_, callback) => {
    return callback(null, true)
  }
}))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/api/cows', recordsGet)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

io.on('connection', (socket) => {
  console.log('a user has connected!')

  socket.on('disconnect', () => {
    console.log('a user has disconnected')
  })
})

server.listen(PORT, async () => {
  const client = await ttsConnection()
  await dbConnection()
  listenMessage(client, io)
  console.log(`Server escuchando en el puerto: ${PORT}`)
})
