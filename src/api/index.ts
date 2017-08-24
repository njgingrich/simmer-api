import * as winston from 'winston'

import * as db from '../db'
import {
  GetGameInfoRequest,
  GetGameInfoResponse,
  GetRecentGamesRequest,
  GetRecentGamesResponse,
  GetUserSummaryRequest,
  GetUserSummaryResponse,
  HTTPStatus,
} from '../models/api'

export function getUserSummary(req: GetUserSummaryRequest): Promise<GetUserSummaryResponse> {
  return db
    .query(
      `SELECT id, display_name, last_logoff, profile_url, avatar_url
                 FROM users
                 WHERE id = $1`,
      [req.steam_id]
    )
    .then((res: any) => {
      const user = res.rows[0]
      return {
        status: HTTPStatus.OK,
        result: {
          steam_id: user.id,
          message: '',
          display_name: user.display_name,
          last_logoff: user.last_logoff,
          urls: {
            profile: user.profile_url,
            avatar: user.avatar_url,
          },
          playtimes: {
            totals: {
              today: 1,
              week: 2,
              two_weeks: 3,
              forever: 4,
            },
            recent_games: [],
            games: [
              {
                app_id: 'test',
                today: 1,
                week: 2,
                two_weeks: 3,
                forever: 4,
              },
            ],
          },
        },
      }
    })
    .catch((err: any) => {
      return {
        status: HTTPStatus.NOT_FOUND,
        result: {
          steam_id: req.steam_id,
          message: `Error getting user summary: ${err}`,
        },
      }
    })
}

export function getGameInfo(req: GetGameInfoRequest): Promise<GetGameInfoResponse> {
  return db
    .query('SELECT id, name, description, image_url, screenshots FROM games WHERE id = $1', [req.app_id])
    .then((res: any) => {
      winston.log('debug', 'GetGameInfo response:' + res)
      const game = res.rows[0]
      return {
        status: HTTPStatus.OK,
        result: {
          app_id: game.id,
          name: game.name,
          description: game.description,
          image_url: game.image_url,
          screenshots: game.screenshots,
        },
      }
    })
    .catch((err: any) => {
      return {
        status: HTTPStatus.NOT_FOUND,
        result: {
          app_id: req.app_id,
          message: `Error getting game info for app_id=${req.app_id}: ${err}`,
        },
      }
    })
}
export function getRecentGamesForUser(req: GetRecentGamesRequest): Promise<GetRecentGamesResponse> {
  return db
    .query('SELECT app_id, two_weeks FROM playtimes WHERE steam_id = $1', [req.steam_id])
    .then((res: any) => {
      winston.log('debug', 'GetRecentGames response:' + res)
      const games = res.rows.filter((game: any) => parseInt(game.two_weeks, 10) > 0)
      return {
        status: HTTPStatus.OK,
        result: {
          games: games.map((g: any) => g.app_id),
        },
      }
    })
    .catch((err: any) => {
      return {
        status: HTTPStatus.NOT_FOUND,
        result: {
          steam_id: req.steam_id,
          message: `Error getting recent games: ${err}`,
        },
      }
    })
}
