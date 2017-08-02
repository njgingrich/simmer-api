import * as express from 'express'
import index from './routes/index'

export function installEndpoints (app: express.Express): void {
  app.use('/', index)
}
