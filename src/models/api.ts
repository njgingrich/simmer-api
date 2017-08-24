/**
 * Request & Response information for a GetGameInfo external API call.
 */
export interface GetGameInfoRequest {
  app_id: string
}

export interface GetGameInfoResponse {
  status: HTTPStatus
  result: GameInfo | GetGameInfoErr
}

export interface GetGameInfoErr {
  app_id: string
  message: string
}

/**
 * Request & Response information for a GetPlayerSummary external API call.
 */
export interface GetUserSummaryRequest {
  steam_id: string
}

export interface GetUserSummaryResponse {
  status: HTTPStatus
  result: UserSummary | GetUserSummaryErr
}
export interface GetUserSummaryErr {
  steam_id: string
  message: string
}

/**
 * Request & Response information for a GetRecentGames API call.
 */
export interface GetRecentGamesRequest {
  steam_id: string
}

export interface GetRecentGamesResponse {
  status: HTTPStatus
  result: RecentGames | GetRecentGamesErr
}

export interface GetRecentGamesErr {
  steam_id: string
  message: string
}

/**
 * Status codes to use when making an HTTP request
 */
export enum HTTPStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST= 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404
}

export interface UserSummary {
  steam_id: string
  display_name: string
  last_logoff: number
  urls: {
    profile: string
    avatar: string
  },
  playtimes: {
    totals: {
      today: number
      week: number
      two_weeks: number
      forever: number
    }
    games: Playtime[]
  }
}

export interface Playtime {
  app_id: string
  today: number
  week: number
  two_weeks: number
  forever: number
}

export interface GameInfo {
  app_id: string
  name: string
  description: string
  image_url: string
  screenshots: string[]
}

export interface RecentGames {
  games: string[]
}
