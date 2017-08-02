import { Router } from 'express'

import * as api from '../api/'
import { config } from '../config'
import {
  GetPlayerSummaryResponse,
  GetRecentGamesResponse,
} from '../models/api'

const users: Router = Router()

users.get('/:id', function (req, res, next): void {
  api.getPlayerSummary({ steam_id: req.params.id })
    .then((response: GetPlayerSummaryResponse) => {
      res.json(response)
    })
})

users.get('/:id/recent', function (req, res, next): void {
  api.getRecentGames({ steam_id: req.params.id })
    .then((response: GetRecentGamesResponse) => {
      res.json(response)
    })
})

export default users
