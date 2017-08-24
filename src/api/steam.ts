import * as request from 'request-promise-native'

import { config } from '../config'
import * as db from '../db'
import {
  GetGameInfoRequest,
  GetGameInfoResponse,
  GetUserSummaryRequest,
  GetUserSummaryResponse,
  GetRecentGamesRequest,
  GetRecentGamesResponse,
  HTTPStatus
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
    url: `${STORE_API_URL}appdetails`
  }).then (response => {
    db.putGameInfo(response)

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

export function getUserSummary (req: GetUserSummaryRequest): void {
  makeRequest({
    url: `${WEB_API_URL}ISteamUser/GetPlayerSummaries/v0002/`,
    qs: {
      key: config.api_key,
      steamids: req.steam_id,
    }
  }).then(response => {
    response = response.response.players[0]
    db.putUserSummary(response)

  }).catch((err) => {
    console.log(`Error inserting user summary: ${err}`)
  })
}

export function getRecentGames (req: GetRecentGamesRequest): Promise<GetRecentGamesResponse> {
  return makeRequest({
    url: `${WEB_API_URL}IPlayerService/GetRecentlyPlayedGames/v0001/`,
    qs: {
      key: config.api_key,
      steamid: req.steam_id,
    }
  }).then(response => {
    response = response.response.games
    let games: any[] = []
    response.forEach((r: any) => {
      games.push({
        app_id: r.appid,
        two_weeks: r.playtime_2weeks,
        forever: r.playtime_forever,
      })
    })
    db.putUserPlaytimes(req.steam_id, games)

  }).catch((err) => {
    console.log(`Error inserting playtime for user: ${err}`)
  })
}
