import { Task, TASK_STATUS } from './Task'
import * as steam from '../api/steam'

export interface UserPlaytimesTaskParams {
  task_id: number
  steam_id: string
}

export class FetchUserPlaytimesTask extends Task {
  steam_id: string

  constructor(params: UserPlaytimesTaskParams) {
    super(params.task_id)
    this.steam_id = params.steam_id
  }

  performTask(): Promise<boolean> {
    return steam
      .getRecentGames({ steam_id: this.steam_id })
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
