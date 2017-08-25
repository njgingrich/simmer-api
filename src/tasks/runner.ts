import * as winston from 'winston'
import { QueryResult } from 'pg'
import * as db from '../db'
import { Task, TASK_STATUS } from './Task'

export class TaskRunner {
  tasks_count: number
  tasks: Task[]

  constructor() {
    this.tasks_count = 0
    this.tasks = []
  }

  runTask(task: Task): void {
    this.updateTask(task, TASK_STATUS.ACTIVE)
      .then(() => {
        return task.performTask()
      })
      .then(success => {
        winston.log('info', `Performed Task ${task.id}, which ${success ? 'succeeded' : 'failed'}`)
        return task.useResults()
      })
      .then(success => {
        return winston.log('info', `Used Results of Task ${task.id}, which ${success ? 'succeeded' : 'failed'}`)
      })
      .then(() => {
        this.updateTask(task, TASK_STATUS.COMPLETE)
      })
  }

  scheduleTask(task: Task, time: Date): void {
    this.tasks_count += 1
    task.id = this.tasks_count
    db
      .putTask(task)
      .then(() => {
        this.tasks.push(task)
        this.updateTask(task, TASK_STATUS.SCHEDULED)
      })
      .then(() => {
        this.runTask(task)
      })
  }

  updateTask(task: Task, status: number): Promise<QueryResult> {
    task.status = status
    return db.updateTaskStatus(task)
  }
}
