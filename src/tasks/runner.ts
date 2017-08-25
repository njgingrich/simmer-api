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
        winston.log('info', `Performed Task ${task.id}, which ${success ? 'succeeded' : 'failed'}`)
        return task.useResults()
      })
      .then(success => {
        return winston.log('info', `Used Results of Task ${task.id}, which ${success ? 'succeeded' : 'failed'}`)
      })
      .then(() => {
        return this.updateTask(task, TASK_STATUS.COMPLETE)
      })
  }

  runTasks(): void {
    setInterval(() => {
      console.log('Looking for tasks...')
      this.tasks.forEach((item, i) => {
        if (item.time <= new Date().getTime()) {
          console.log(`Running task ${item.task.id}`)
          this.updateTask(item.task, TASK_STATUS.ACTIVE)
            .then(() => {
              return this.runTask(item.task)
            })
            .then(() => {
              console.log(`Removing task ${item.task.id} w/ index ${i}`)
              this.tasks.splice(i, 1)
            })
        }
      })
    }, 4000)
  }

  scheduleTask(task: Task, time: Date): void {
    this.tasks_count += 1
    task.id = this.tasks_count
    db.putTask(task).then(() => {
      console.log(`adding task ${task.id}`)
      this.tasks.push({ task, time: time.getTime() })
      this.updateTask(task, TASK_STATUS.SCHEDULED)
    })
  }

  updateTask(task: Task, status: number): Promise<QueryResult> {
    task.status = status
    return db.updateTaskStatus(task)
  }
}
