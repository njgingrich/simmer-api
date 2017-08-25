import * as http from 'http'
import * as winston from 'winston'

import app from './app'
import * as steam from './api/steam'
import * as api from './api'
import { UserSummary } from './models/api'
import { config } from './config'
import { TaskRunner } from './tasks/runner'
import { FetchGameInfoTask } from './tasks/FetchGameInfo'
import { FetchUserSummaryTask } from './tasks/FetchUserSummary'
import { FetchUserPlaytimesTask } from './tasks/FetchUserPlaytimes'

const server = http.createServer(app)
server.listen(config.port)
server.on('listening', () => {
  setup()
  console.log(`listening on port: ${config.port}`)
})

function setup(): void {
  winston.add(winston.transports.File, {
    name: 'file#debug',
    filename: 'logs/simmer.debug.log',
    level: 'debug',
    colorize: 'true',
    timestamp: 'true',
  })
  winston.add(winston.transports.File, {
    name: 'file#all',
    filename: 'logs/simmer.log',
    colorize: 'true',
    timestamp: 'true',
  })

  const runner = new TaskRunner()
  runner.scheduleTask(new FetchGameInfoTask({ app_id: '570' }), new Date('2017-08-25T01:42:30Z'))
  runner.scheduleTask(new FetchGameInfoTask({ app_id: '377160' }), new Date('2017-08-25T01:43:00Z'))
  runner.scheduleTask(new FetchUserSummaryTask({ steam_id: config.profile_id }), new Date())
  runner.scheduleTask(new FetchUserPlaytimesTask({ steam_id: config.profile_id }), new Date())

  setTimeout(() => {
    api.getUserSummary({ steam_id: config.profile_id }).then(summary => {
      const result = summary.result
      if ((result as UserSummary).recent_games) {
        let promises: Promise<any>[] = []
        ;(result as UserSummary).recent_games.forEach(app_id => {
          promises.push(api.getGameInfo({ app_id }))
        })
        Promise.all(promises)
      }
    })
  }, 3000)
}
