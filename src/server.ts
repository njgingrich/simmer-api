import * as http from 'http'
import * as winston from 'winston'

import app from './app'
import * as steam from './api/steam'
import * as api from './api'
import { config } from './config'

const server = http.createServer(app)
server.listen(config.port)
server.on('listening', () => {
  setup()
  console.log(`listening on port: ${config.port}`)
})

function setup(): void {
  winston.add(winston.transports.File, {
    filename: 'logs/simmer.log',
    level: 'debug',
    colorize: 'true',
    timestamp: 'true',
  })

  steam
    .getGameInfo({ app_id: '570' })
    .then(() => api.getGameInfo({ app_id: '570' }))
    .then(() => steam.getUserSummary({ steam_id: config.profile_id }))
    .then(() => api.getUserSummary({ steam_id: config.profile_id }))
    .then(() => steam.getRecentGames({ steam_id: config.profile_id }))
    .then(() => api.getRecentGamesForUser({ steam_id: config.profile_id }))
    .then(res => winston.log('debug', 'GetRecentGamesForUser:', res))
}
