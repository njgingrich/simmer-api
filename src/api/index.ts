import * as request from 'request-promise-native'

import { config } from '../config'
import {
  GetGameInfoRequest,
  GetGameInfoResponse,
  GetPlayerSummaryRequest,
  GetPlayerSummaryResponse,
  GetRecentGamesRequest,
  GetRecentGamesResponse,
  HTTPStatus,
  RecentGame
} from '../models/api'

const WEB_API_URL = 'http://api.steampowered.com/'
const STORE_API_URL = 'http://store.steampowered.com/api/'
const defaultOptions = {
  url: '',
  method: 'GET',
  mode: 'cors',
  headers: {
    'User-Agent': 'Request-Promise',
  },
  json: true,
}

function makeRequest (opts: object): Promise<any> {
  const merged = Object.assign({}, defaultOptions, opts)
  return request(merged)
}

export function getGameInfo (req: GetGameInfoRequest): Promise<GetGameInfoResponse> {
  return makeRequest({
    url: `${STORE_API_URL}appdetails`,
    qs: {
      appids: req.app_id,
    },
  }).then (response => {
    response = response[req.app_id]

    return {
      status: HTTPStatus.OK,
      result: {
        app_id: req.app_id,
        name: response.data.name,
        image: response.data.header_image,
        description: response.data.short_description,
        screenshots: response.data.screenshots.map( (s: any) =>  s.path_full )
      }
    }
  }).catch (() => {
    return {
      status: HTTPStatus.BAD_REQUEST,
      result: {
        app_id: req.app_id,
        message: 'Game was not found',
      }
    }
  })
}

export function getPlayerSummary (req: GetPlayerSummaryRequest): Promise<GetPlayerSummaryResponse> {
  return request({
    url: `${WEB_API_URL}ISteamUser/GetPlayerSummaries/v0002/`,
    qs: {
      key: config.api_key,
      steamids: req.steam_id,
    },
    headers: {
    },
    json: true,
  }).then (response => {
    response = response.response.players[0]

    return {
      status: HTTPStatus.OK,
      result: {
        steam_id: response.steamid,
        display_name: response.personaname,
        last_logoff: response.lastlogoff,
        urls: {
          profile: response.profileurl,
          avatar: response.avatarfull,
        },
      }
    }
  }).catch (() => {
    return {
      status: HTTPStatus.BAD_REQUEST,
      result: {
        steam_id: req.steam_id,
        message: 'User was not found',
      }
    }
  })
}

export function getRecentGames ( req: GetRecentGamesRequest): Promise<GetRecentGamesResponse> {
  return request({
    url: `${WEB_API_URL}IPlayerService/GetRecentlyPlayedGames/v0001/`,
    qs: {
      key: config.api_key,
      steamid: req.steam_id,
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true,
  }).then (response => {
    response = response.response.games
    let games: RecentGame[] = []
    response.forEach((r: any) => {
      games.push({
        app_id: r.appid,
        name: r.name,
        two_weeks: r.playtime_2weeks,
        forever: r.playtime_forever,
      })
    })

    return {
      status: HTTPStatus.OK,
      result: {
        games
      }
    }
  }).catch (() => {
    return {
      status: HTTPStatus.BAD_REQUEST,
      result: {
        steam_id: req.steam_id,
        message: 'User was not found'
      }
    }
  })
}
