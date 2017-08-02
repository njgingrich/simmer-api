import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as path from 'path'

import { installEndpoints } from './index'

const app: express.Express = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'pug')
installEndpoints(app)

app.use((req: express.Request,
         res: express.Response,
         next: express.NextFunction) => {
  const err = new Error('Not Found')
  err['status'] = 404
  next(err)
})

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

  app.use((error: any,
           req: express.Request,
           res: express.Response,
           next: express.NextFunction) => {
    res.status(error['status'] || 500)
    res.render('error', {
      message: error.message,
      error
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use((error: any,
         req: express.Request,
         res: express.Response,
         next: express.NextFunction) => {
  res.status(error['status'] || 500)
  res.render('error', {
    message: error.message,
    error: {}
  })
})

export default app
