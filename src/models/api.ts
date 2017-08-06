/**
 * Request & Response information for a GetGameInfo API call.
 */
export interface GetGameInfoRequest {
  app_id: string
}

export interface GetGameInfoResponse {
  status: HTTPStatus,
  result: GetGameInfoSuccess | GetGameInfoErr
}

export interface GetGameInfoSuccess {
  app_id: string
  name: string
  image: string
  description: string
  screenshots: string[]
}

export interface GetGameInfoErr {
  app_id: string
  message: string
}

/**
 * Request & Response information for a GetPlayerSummary API call.
 */
export interface GetPlayerSummaryRequest {
  steam_id: string
}

export interface GetPlayerSummaryResponse {
  status: HTTPStatus
  result: GetPlayerSummarySuccess | GetPlayerSummaryErr
}

export interface GetPlayerSummarySuccess {
  steam_id: string
  display_name: string
  last_logoff: number
  urls: {
    profile: string
    avatar: string
  }
}

export interface GetPlayerSummaryErr {
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
  result: GetRecentGamesSuccess | GetRecentGamesErr
}

export interface GetRecentGamesSuccess {
  games: RecentGame[]
}

export interface GetRecentGamesErr {
  steam_id: string
  message: string
}

export interface RecentGame {
  app_id: string
  name: string
  two_weeks: number
  forever: number
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
