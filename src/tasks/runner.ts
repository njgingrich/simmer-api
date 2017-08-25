import * as winston from 'winston'
import { QueryResult } from 'pg'
import * as db from '../db'
import { Task, TASK_STATUS } from './Task'

export interface TaskItem {
  task: Task
  time: number
}

export class TaskRunner {
  tasks_count: number
  tasks: TaskItem[]

  constructor() {
    this.tasks_count = 0
    this.tasks = []
    this.runTasks()
  }

  runTask(task: Task): Promise<any> {
    return task
      .performTask()
      .then(success => {
        winston.log('info', `performTask() ${task.id} - ${success ? 'succeeded' : 'failed'}`)
        return task.useResults()
      })
      .then(success => {
        return winston.log('info', `useResults() ${task.id} - ${success ? 'succeeded' : 'failed'}`)
      })
      .then(() => {
        return this.updateTask(task, TASK_STATUS.COMPLETE)
      })
  }

  runTasks(): void {
    let scheduler = () => {
      this.tasks.forEach((item: TaskItem, i: number) => {
        if (item.time <= new Date().getTime() && item.task.status === TASK_STATUS.SCHEDULED) {
          winston.log('info', `Running task ${item.task.id} - ${item.task.type}`)
          this.updateTask(item.task, TASK_STATUS.ACTIVE).then(() => {
            return this.runTask(item.task)
          })
        }
      })
      for (let i = this.tasks.length - 1; i >= 0; i--) {
        if (this.tasks[i].task.status === TASK_STATUS.ACTIVE) {
          winston.log('info', `Removing task ${this.tasks[i].task.id} - ${this.tasks[i].task.type}`)
          this.tasks.splice(i, 1)
        }
      }

      setTimeout(scheduler, 6000)
    }
    scheduler()
  }

  scheduleTask(task: Task, time: Date): void {
    this.tasks_count += 1
    task.id = this.tasks_count
    db.putTask(task).then(() => {
      this.tasks.push({ task, time: time.getTime() })
      this.updateTask(task, TASK_STATUS.SCHEDULED)
    })
  }

  updateTask(task: Task, status: number): Promise<QueryResult> {
    task.status = status
    return db.updateTaskStatus(task)
  }
}
