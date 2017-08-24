import * as db from '../db'
import {
  GetGameInfoRequest,
  GetGameInfoResponse,
  GetRecentGamesRequest,
  GetRecentGamesResponse,
  GetUserSummaryRequest,
  GetUserSummaryResponse,
  HTTPStatus
} from '../models/api'

export function getUserSummary (req: GetUserSummaryRequest): Promise<GetUserSummaryResponse> {
  return db.query(`SELECT id, display_name, last_logoff, profile_url, avatar_url
                 FROM users
                 WHERE id = $1`, [req.steam_id])
  .then((res: any) => {
    const user = res.rows[0]
    return {
      status: HTTPStatus.OK,
      result: {
        steam_id: user.id,
        display_name: user.display_name,
        last_logoff: user.last_logoff,
        urls: {
          profile: user.profile_url,
          avatar: user.avatar_url
        },
        playtimes: {
          totals: {
            today: 1,
            week: 2,
            two_weeks: 3,
            forever: 4,
          },
          games: [
            {
              app_id: 'test',
              today: 1,
              week: 2,
              two_weeks: 3,
              forever: 4,
            }
          ]
        }
      }
    }
  })
  .catch((err: any) => {
    return {
      status: HTTPStatus.NOT_FOUND,
      steam_id: req.steam_id,
      message: `Error getting user summary: ${err}`
    }
  })
}

export function getGameInfo (req: GetGameInfoRequest): Promise<GetGameInfoResponse> {
  return db.query('SELECT id, name, description, image_url, screenshots FROM users where id= $1', [req.app_id])
  .then((res: any) => {
    const game = res.rows[0]
    return {
      status: HTTPStatus.OK,
      result: {
        app_id: game.id,
        name: game.name,
        description: game.description,
        image_url: game.image,
        screenshots: game.screenshots,
      }
    }
  })
  .catch((err: any) => {
    return {
      status: HTTPStatus.NOT_FOUND,
      app_id: req.app_id,
      message: `Error getting game info: ${err}`
    }
  })
}
export function getRecentGamesForUser (req: GetRecentGamesRequest): Promise<GetRecentGamesResponse> {
  return query('SELECT app_id FROM playtimes WHERE id = $1', [req.steam_id])
  .then(res => {
    const games = res.rows.filter(game => parseInt(game.two_weeks, 10) > 0)
    return {
      status: HTTPStatus.OK,
      result: { games }
    }
  })
  .catch(err => {
    return {
      status: HTTPStatus.NOT_FOUND,
      steam_id: req.steam_id,
      message: `Error getting recent games: ${err}`
    }
  })
}