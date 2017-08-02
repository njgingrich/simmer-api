import * as request from 'request-promise-native'

import { config } from '../config'
import {
  GetGameInfoRequest,
  GetGameInfoResponse,
  GetPlayerSummaryRequest,
  GetPlayerSummaryResponse,
  GetRecentGamesRequest,
  GetRecentGamesResponse,
  RecentGame
} from '../models/api'

const WEB_API_URL = 'http://api.steampowered.com/'
const STORE_API_URL = 'http://store.steampowered.com/api/'

export function getGameInfo (req: GetGameInfoRequest): Promise<GetGameInfoResponse> {
  return request({
    url: `${STORE_API_URL}appdetails`,
    qs: {
      appids: req.steam_id,
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true,
  }).then (response => {
    response = response[req.steam_id]

    return {
      app_id: req.steam_id,
      name: response.data.name,
      description: response.data.short_description,
      screenshots: response.data.screenshots.map( (s: any) =>  s.path_full )
    }
  }).catch (err => {
    return err
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
      'User-Agent': 'Request-Promise'
    },
    json: true,
  }).then (response => {
    response = response.response.players[0]

    return {
      steam_id: response.steamid,
      display_name: response.personaname,
      last_logoff: response.lastlogoff,
      urls: {
        profile: response.profileurl,
        avatar: response.avatarfull,
      },
    }
  }).catch (err => {
    return err
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

    return games

  }).catch (err => {
    return err
  })
}
