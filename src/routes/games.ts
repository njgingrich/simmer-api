import { Router } from 'express'

const games: Router = Router()

games.get('/:id', function (req, res, next) {
  res.json({ title: 'Hello world' + req.params.id })
})

export default games
