import { Router } from 'express'

import * as api from '../api/'
import { config } from '../config'

const games: Router = Router()

games.get('/:id', function (req, res, next) {
  api.getPlayerSummary({ id: config.profile_id })
    .then(summary => {
      res.json(summary)
    })
})

export default games
