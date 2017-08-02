export interface GetGameInfoRequest {
  id: string
}

export interface GetGameInfoResponse {
  id: string
  name: string
  description: string
  screenshots: string[]
}

export interface GetPlayerSummaryRequest {
  id: string
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
