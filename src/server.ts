import * as http from 'http'
import app from './app'
import * as steam from './api/steam'
import * as api from './api'
import { config } from './config'

const server = http.createServer(app)
server.listen(config.port)
server.on('listening', () => {
  /*
  steam.getGameInfo({app_id: '570'})
    .then(() => {
      return api.getGameInfo({app_id: '570'})
    })
    .then((res) => {
      console.log(res)
    })
  */
  /*
  steam.getUserSummary({steam_id: config.profile_id})
    .then(() => {
      return api.getUserSummary({steam_id: config.profile_id})
    })
    .then((res) => {
      console.log(res)
    })
  */
  console.log('calling STEAM getRecentGames')
  steam.getRecentGames({steam_id: config.profile_id})
    .then(() => {
      console.log('calling API getRecentGames')
      return api.getRecentGamesForUser({steam_id: config.profile_id})
    })
    .then((res) => {
      console.log('response from API getRecentGames')
      console.log(res)
    })
  console.log(`listening on port: ${config.port}`)
})
