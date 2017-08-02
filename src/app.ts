import * as bodyParser from 'body-parser'
import * as express from 'express'
import { installEndpoints } from './index'

const app: express.Express = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
installEndpoints(app)

export default app
