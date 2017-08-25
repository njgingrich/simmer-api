import { Task, TASK_STATUS } from './Task'
import * as steam from '../api/steam'

export interface UserSummaryTaskParams {
  steam_id: string
}

export class FetchUserSummaryTask extends Task {
  steam_id: string

  constructor(params: UserSummaryTaskParams) {
    super()
    this.info = { params: { steam_id: params.steam_id } }
    this.type = 'FetchUserSummary'
    this.steam_id = params.steam_id
  }

  performTask(): Promise<boolean> {
    return steam
      .getUserSummary({ steam_id: this.steam_id })
      .then(() => {
        return steam.getRecentGames({ steam_id: this.steam_id })
      })
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  useResults(): Promise<boolean> {
    return Promise.resolve(true)
  }
}
