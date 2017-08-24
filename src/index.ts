import * as express from 'express'
import index from './routes/index'
import games from './routes/games'
import users from './routes/users'

export function installEndpoints(app: express.Express): void {
  app.use('/', index)
  app.use('/games', games)
  app.use('/users', users)
}
