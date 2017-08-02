import {
  GetPlayerSummaryRequest,
  GetPlayerSummaryResponse
} from '../models/api'

// http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={key}&steamids={id}
export function getPlayerSummary (req: GetPlayerSummaryRequest): Promise<GetPlayerSummaryResponse> {
  return Promise.resolve({id: 4})
}
