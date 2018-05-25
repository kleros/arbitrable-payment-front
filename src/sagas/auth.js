import { call, fork, takeLatest, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import * as authActions from '../actions/auth'
import { kleros, eth } from '../bootstrap/dapp-api'
import { ETH_NO_ACCOUNTS } from '../constants/errors'
import { action } from '../utils/action'
import { fetchSaga, updateSaga } from '../utils/saga'

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
  let isValid = false
  // Check to make sure saved token is valid.
  if (token) {
    isValid = yield call(
      kleros.auth.validateAuthToken,
      accounts[0],
      token
    )

    // update storage on validity of token
    yield put(
      action(
        authActions.token.RECEIVE_UPDATED,
        {
          [authActions.token.self] : { isValid }
        }
      )
    )
  }

  // if we either do not have a token or it is invalid, redirect
  if (!token || !isValid) {
    yield put(push('/login'))
  }
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

  return { isValid: true }
}

function* validateAuthToken() {
  const accounts = yield call(eth.accounts)
  if (!accounts[0]) throw new Error(ETH_NO_ACCOUNTS)

  const storage = window.localStorage
  const authTokens = storage.getItem('auth')
    ? JSON.parse(storage.getItem('auth'))
    : {}

  let token = authTokens[accounts[0]]
  const isValid = yield call(
    kleros.auth.validateAuthToken,
    accounts[0],
    token
  )
  return { isValid }
}

/**
 * The root of the notification saga.
 */
export default function* authSaga() {
  // Listeners
  yield fork(setToken)

  yield takeLatest(
    authActions.token.FETCH,
    fetchSaga,
    authActions.token,
    newAuthToken
  )

  yield takeLatest(
    authActions.token.VALIDATE,
    updateSaga,
    authActions.token,
    validateAuthToken
  )
}
