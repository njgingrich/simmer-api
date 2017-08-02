import * as request from 'request-promise-native'

import { config } from '../config'
import {
  GetPlayerSummaryRequest,
  GetPlayerSummaryResponse
} from '../models/api'

const BASE_URL = `http://api.steampowered.com/`

export function getPlayerSummary (req: GetPlayerSummaryRequest): Promise<any> {
  return request({
    url: `${BASE_URL}ISteamUser/GetPlayerSummaries/v0002/`,
    qs: {
      key: config.api_key,
      steamids: req.id,
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true,
  }).then (response => {
    return response
  }).catch (err => {
    return err
  })
}
