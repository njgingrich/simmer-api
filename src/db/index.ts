import { Pool, QueryResult } from 'pg'
import * as winston from 'winston'
import { Task } from '../tasks/Task'

const pool = new Pool({
  host: 'localhost',
  user: 'nathan',
  database: 'simmer',
  max: 20,
  idleTimeoutMillis: 30000,
})

export function query(text: string, params: any[]): Promise<QueryResult> {
  winston.log('debug', `PERFORMING QUERY => ${text}`)
  return pool
    .query(text, params)
    .then(res => {
      winston.log('debug', 'result from query:', res)
      return res
    })
    .catch(err => {
      winston.log('error', 'CAUGHT IN QUERY:', err)
      return err
    })
}

export function putUserSummary(json: any): Promise<QueryResult> {
  return query(
    'INSERT INTO users(id, display_name, last_logoff, profile_url, avatar_url, last_fetch) VALUES ($1, $2, to_timestamp($3), $4, $5, $6)' +
      'ON CONFLICT (id) DO UPDATE SET display_name = $2, last_logoff = to_timestamp($3), profile_url = $4, avatar_url = $5, last_fetch = $6',
    [json.steamid, json.personaname, json.lastlogoff, json.profileurl, json.avatarfull, new Date().toISOString()]
  )
}

export function putUserPlaytimes(steam_id: string, game: any) {
  const today = game.two_weeks
  const week = game.two_weeks
  return query(
    'INSERT INTO playtimes(steam_id, app_id, today, week, two_weeks, forever, last_fetch) VALUES ($1, $2, $3, $4, $5, $6, $7)' +
      'ON CONFLICT ON CONSTRAINT playtimes_pkey DO UPDATE SET today = $3, week = $4, two_weeks = $5, forever = $6, last_fetch = $7',
    [steam_id, game.app_id, today, week, game.two_weeks, game.forever, new Date().toISOString()]
  )
}

export function putUserRecentGames(steam_id: string, games: any) {
  return query('UPDATE users SET recent_games = $1 WHERE id = $2', [games, steam_id])
}

export function putGameInfo(json: any): Promise<QueryResult> {
  const app_id = Object.keys(json)[0]
  json = json[app_id].data
  return query(
    'INSERT INTO games(id, name, description, image_url, screenshots, last_fetch) VALUES ($1, $2, $3, $4, $5, $6)' +
      'ON CONFLICT (id) DO UPDATE SET name = $2, description = $3, image_url = $4, screenshots = $5, last_fetch = $6',
    [
      app_id,
      json.name,
      json.short_description,
      json.header_image,
      json.screenshots.map((s: any) => s.path_full),
      new Date().toISOString(),
    ]
  )
}

export function putTask(task: Task): Promise<QueryResult> {
  winston.log('debug', `insert task ${task.id} with status ${task.status} in db`)
  return query('INSERT INTO tasks(id, info, status) VALUES ($1, $2, $3)', [task.id, task.info, task.status])
}

export function updateTaskStatus(task: Task): Promise<QueryResult> {
  winston.log('debug', `set task ${task.id} to status ${task.status} in db`)
  return query('UPDATE tasks SET status = $1 WHERE id = $2', [task.status, task.id])
}
