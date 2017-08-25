import * as db from '../db'

export enum TASK_STATUS {
  CREATED = 0,
  SCHEDULED = 1,
  ACTIVE = 2,
  COMPLETE = 3,
}

export abstract class Task {
  id: number
  info: {}
  status: TASK_STATUS

  constructor() {
    this.info = {}
    this.status = TASK_STATUS.CREATED
  }
  abstract performTask(): Promise<boolean>
  abstract useResults(): Promise<boolean>
}
