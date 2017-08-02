export interface GetGameInfoRequest {
  steam_id: string
}

export interface GetGameInfoResponse {
  app_id: string
  name: string
  description: string
  screenshots: string[]
}

export interface GetPlayerSummaryRequest {
  steam_id: string
}

export interface GetPlayerSummaryResponse {
  steam_id: string
  display_name: string
  last_logoff: number
  urls: {
    profile: string
    avatar: string
  }
}

export interface GetRecentGamesRequest {
  steam_id: string
}

export interface GetRecentGamesResponse {
  games: RecentGame[]
}

export interface RecentGame {
  app_id: string
  name: string
  two_weeks: number
  forever: number
}
