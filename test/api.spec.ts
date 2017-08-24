import * as api from '../src/api'
import { config } from '../src/config'
import { expect } from 'chai'
import {
  GetGameInfoRequest,
  GetGameInfoResponse,
  GetUserSummaryRequest,
  GetUserSummaryResponse,
  GetRecentGamesRequest,
  GetRecentGamesResponse,
  HTTPStatus
} from '../src/models/api'

const STEAM_ID = config.profile_id
const APP_ID = '570' // dota 2

describe('API', () => {
  describe('GetGameInfo', () => {
    it('should parse GetGameInfo correctly', (done) => {
      api.getGameInfo({ app_id: APP_ID })
        .then((json: any) => {
          expect(json.status).to.eq(HTTPStatus.OK)
          json = json.result
          expect(json.app_id).to.eq('570')
          expect(json.name).to.eq('Dota 2')
          expect(json.image).to.be.a('string')
          expect(json.description).to.be.a('string')
          expect(json.screenshots).to.be.a('array')
          done()
        })
        .catch((err: any) => {
          console.log('err:', err)
        })
    })
    it('should return an error message if app id is not found', (done) => {
      api.getGameInfo({ app_id: '999999999' })
        .then((json: any) => {
          expect(json.status).to.eq(HTTPStatus.BAD_REQUEST)
          expect(json.result.app_id).to.eq('999999999')
          expect(json.result.message).to.eq('Game was not found')
          done()
        })
        .catch((err: any) => {
          console.log('err:', err)
        })
    })
  })

  describe('GetUserSummary', () => {
    it('should parse GetUserSummary correctly', (done) => {
      api.getUserSummary({ steam_id: STEAM_ID })
        .then((json: any) => {
          expect(json.status).to.eq(HTTPStatus.OK)
          json = json.result
          expect(json.steam_id).to.eq(STEAM_ID)
          expect(json.display_name).to.be.a('string')
          expect(json.last_logoff).to.be.a('number')
          expect(json.urls.profile).to.be.a('string')
          expect(json.urls.avatar).to.be.a('string')
          done()
        })
        .catch((err: any) => {
          console.log('err:', err)
        })
    })
    it('should return an error message if the user is not found', (done) => {
      api.getUserSummary({ steam_id: '-1' })
        .then((json: any) => {
          expect(json.status).to.eq(HTTPStatus.BAD_REQUEST)
          expect(json.result.steam_id).to.eq('-1')
          expect(json.result.message).to.eq('User was not found')
          done()
        })
        .catch((err: any) => {
          console.log('err:', err)
        })
    })
  })

  describe('GetRecentGames', () => {
    it('should parse GetRecentGames correctly', (done) => {
      api.getRecentGamesForUser({ steam_id: STEAM_ID })
        .then((json: any) => {
          expect(json.status).to.eq(HTTPStatus.OK)
          json = json.result
          expect(json.games).to.be.a('array')
          done()
        })
        .catch((err: any) => {
          console.log('err:', err)
        })
    })
    it('should return an error message if the user is not found', (done) => {
      api.getRecentGamesForUser({ steam_id: '-1' })
        .then((json: any) => {
          expect(json.status).to.eq(HTTPStatus.BAD_REQUEST)
          expect(json.result.steam_id).to.eq('-1')
          expect(json.result.message).to.eq('User was not found')
          done()
        })
        .catch((err: any) => {
          console.log('err:', err)
        })
    })
  })
})
