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
