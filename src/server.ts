import * as http from 'http'
import * as winston from 'winston'

import app from './app'
import * as steam from './api/steam'
import * as api from './api'
import { RecentGames, UserSummary } from './models/api'
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

const setup = function(): void {
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
  loopTasks(runner)

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

const loopTasks = function(runner: TaskRunner): void {
  const HOUR = 1000 * 60 * 60
  const DAY = 1000 * 60 * 60 * 24
  const hourly = () => {
    winston.log('info', 'Running hourly tasks')
    runner.scheduleTask(new FetchUserSummaryTask({ steam_id: config.profile_id }), new Date())
    setTimeout(hourly, 30000)
  }
  const daily = () => {
    winston.log('info', 'Running daily tasks')
    runner.scheduleTask(new FetchUserPlaytimesTask({ steam_id: config.profile_id }), new Date())
    api.getRecentGamesForUser({ steam_id: config.profile_id }).then(res => {
      const gamesList = res.result as RecentGames
      console.log('games list:', gamesList)
      gamesList.games.forEach(app_id => {
        runner.scheduleTask(new FetchGameInfoTask({ app_id }), new Date())
      })
    })
    setTimeout(daily, 60000)
  }
  hourly()
  daily()
}
