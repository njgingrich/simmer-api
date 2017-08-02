import * as http from 'http'
import app from './app'

const port = 8005
const server = http.createServer(app)
server.listen(port)
server.on('listening', () => {
  console.log('listening!')
})
