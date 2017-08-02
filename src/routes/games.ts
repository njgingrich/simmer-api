import { Router } from 'express'

import * as api from '../api/'
import { config } from '../config'
import {
  GetGameInfoRequest,
  GetGameInfoResponse,
} from '../models/api'

const games: Router = Router()

games.get('/:id', function (req, res, next) {
  api.getGameInfo({ steam_id: req.params.id })
    .then((info: GetGameInfoResponse) => {
      res.json(info)
    })
})

export default games
