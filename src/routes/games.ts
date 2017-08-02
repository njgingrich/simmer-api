import { Router } from 'express'

import * as api from '../api/'
import { config } from '../config'
import {
  GetGameInfoRequest,
  GetGameInfoResponse,
} from '../models/api'

const games: Router = Router()

games.get('/:id', function (req, res, next) {
  const r: GetGameInfoRequest = { id: req.params.id }
  api.getGameInfo(r)
    .then((info: GetGameInfoResponse) => {
      res.json(info)
    })
})

export default games
