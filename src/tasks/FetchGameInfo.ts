import { Task, TASK_STATUS } from './Task'
import * as steam from '../api/steam'

export interface GameInfoTaskParams {
  task_id: number
  app_id: string
}

export class FetchGameInfoTask extends Task {
  app_id: string

  constructor(params: GameInfoTaskParams) {
    super(params.task_id)
    this.app_id = params.app_id
  }

  performTask(): Promise<boolean> {
    return steam
      .getGameInfo({ app_id: this.app_id })
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
