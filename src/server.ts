import * as http from 'http'
import app from './app'
import { config } from './config'

const server = http.createServer(app)
server.listen(config.port)
server.on('listening', () => {
  console.log(`listening on port: ${config.port}`)
})
