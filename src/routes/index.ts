import { Router } from 'express'

const index: Router = Router()

index.get('/', function(req, res, next) {
  res.json({ title: 'Hello world!' })
})

export default index
