import { call, fork, takeLatest } from 'redux-saga/effects'

import { kleros, eth } from '../bootstrap/dapp-api'
import { ETH_NO_ACCOUNTS } from '../constants/errors'
import * as authActions from '../actions/auth'

/**
 * Sets the users auth token.
 */
function* setToken() {
  const accounts = yield call(eth.accounts)
  if (!accounts[0]) throw new Error(ETH_NO_ACCOUNTS)

  const storage = window.localStorage
  const authTokens = storage.getItem('auth')
    ? JSON.parse(storage.getItem('auth'))
    : {}

  let token = authTokens[accounts[0]]
  // Check to make sure saved token is valid.
  if (token) {
    const isValid = yield call(
      kleros.auth.validateAuthToken,
      accounts[0],
      token
    )
    // If token is invalid set to null so we generate a new token.
    if (!isValid) token = null
  }
  // If we do not have a valid token saved create a new one
  // if (!token) yield call(newAuthToken)
}

/**
 * Generate a new auth token and store in local storage
 */
function* newAuthToken() {
  const accounts = yield call(eth.accounts)
  if (!accounts[0]) throw new Error(ETH_NO_ACCOUNTS)

  const storage = window.localStorage
  const authTokens = storage.getItem('auth')
    ? JSON.parse(storage.getItem('auth'))
    : {}

  const signedToken = yield call(kleros.auth.getNewAuthToken, accounts[0])
  authTokens[accounts[0]] = signedToken

  storage.setItem('auth', JSON.stringify(authTokens))
}

/**
 * The root of the notification saga.
 */
export default function* authSaga() {
  // Listeners
  yield fork(setToken)

  yield takeLatest(authActions.FETCH_NEW_TOKEN, newAuthToken)
}
