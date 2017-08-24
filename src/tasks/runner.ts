import * as winston from 'winston'
import { Task, TASK_STATUS } from './Task'

export class TaskRunner {
  tasks: Task[]

  runTask(task: Task): void {
    let success = task.performTask()
    winston.log('info', `Performed Task ${task.id}, which ${success ? 'succeeded' : 'failed'}`)
    success = task.useResults()
    winston.log('info', `Used Results of Task ${task.id}, which ${success ? 'succeeded' : 'failed'}`)
  }

  scheduleTask(task: Task, time: Date): void {
    this.runTask(task)
  }
}
