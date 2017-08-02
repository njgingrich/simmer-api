import { Router } from 'express'

import * as api from '../api/'
import { config } from '../config'
import {
  GetPlayerSummaryRequest,
  GetPlayerSummaryResponse
} from '../models/api'

const users: Router = Router()

users.get('/:id', function (req, res, next): void {
  const r: GetPlayerSummaryRequest = { id: req.params.id }
  api.getPlayerSummary(r)
    .then((summary: GetPlayerSummaryResponse) => {
      res.json(summary)
    })
})

export default users
