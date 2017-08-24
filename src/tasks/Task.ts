export enum TASK_STATUS {
  CREATED,
  ACTIVE,
  COMPLETE,
}

export abstract class Task {
  id: number
  constructor(id: number) {
    this.id = id
  }
  abstract performTask(): Promise<boolean>
  abstract useResults(): Promise<boolean>
}
