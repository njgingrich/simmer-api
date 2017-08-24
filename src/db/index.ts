import { Pool, QueryResult } from 'pg'

const pool = new Pool()

export function query (text: string, params: any[]): Promise<QueryResult> {
  return pool.query(text, params)
}

export function putUserSummary (json: any): Promise<QueryResult> {
  return query('INSERT INTO users(id, display_name, last_logoff, profile_url, avatar_url, last_fetch) VALUES ($1, $2, $3, $4, $5, $6)',
               [json.steamid, json.personaname, json.lastlogoff, json.profileurl, json.avatarfull, Date.now()])
}

export function putUserPlaytimes (steam_id: string, gameJson: any): Promise<QueryResult> {
  let rows: any[] = []
  gameJson.forEach((game: any) => {
    // TODO fix today/week
    const today = game.two_weeks
    const week = game.two_weeks
    rows.push({
      steam_id,
      app_id: game.app_id,
      today,
      week,
      two_weeks: game.two_weeks,
      forever: game.forever
    })
  })
  const params: any[] = []
  const chunks: any[] = []
  rows.forEach(row => {
    const valueClause: any[] = []
    Object.keys(row).forEach(p => {
      params.push(row[p])
      valueClause.push('$' + params.length)
    })
    chunks.push('(' + valueClause.join(', ') + ')')
  })
  const q = {
    text: 'INSERT INTO playtimes(steam_id, app_id, today, week, two_weeks, forever, last_fetch) VALUES ' + chunks.join(', '),
    values: params
  }
  return pool.query(q)
}

export function putGameInfo (json: any): Promise<QueryResult> {
  const app_id = Object.keys(json)[0]
  json = json[app_id].data
  return query('INSERT INTO games(id, name, description, image_url, screenshots, last_fetch) VALUES ($1, $2, $3, $4, $5, $6)',
               [app_id, json.name, json.short_description, json.header_image, json.screenshots.map((s: any) => s.path_full), Date.now()])
}
