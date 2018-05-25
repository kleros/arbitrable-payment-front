import { call, fork, takeLatest, put, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import * as authActions from '../actions/auth'
import * as walletSelectors from '../reducers/wallet'
import { kleros, eth } from '../bootstrap/dapp-api'
import { ETH_NO_ACCOUNTS } from '../constants/errors'
import { action } from '../utils/action'
import { getAuthTokenForAccount, saveAuthTokenForAccount } from '../utils/auth'

/**
 * Sets the users auth token.
 */
function* setToken() {
  // call eth directly so there isn't a race condition with accounts saga
  const accounts = yield call(eth.accounts)
  if (!accounts[0]) throw new Error(ETH_NO_ACCOUNTS)
  const account = accounts[0]

  let token = getAuthTokenForAccount(account)
  let isValid = false
  // Check to make sure saved token is valid.
  if (token) {
    isValid = yield call(
      kleros.auth.validateAuthToken,
      account,
      token
    )
  }

  // if we either do not have a token or it is invalid, logOut
  if (!token || !isValid) {
    yield logOutUser()
  } else {
    // if token is valid go ahead and log in the user.
    yield logInUser(account)
  }
}

/**
 * Generate a new auth token and store in local storage
 */
function* newAuthToken() {
  const account = yield select(walletSelectors.getAccount)

  const signedToken = yield call(kleros.auth.getNewAuthToken, account)
  // save token and
  saveAuthTokenForAccount(signedToken, account)
  yield logInUser()
}

function* logInUser(account) {
  if (!account)
    account = yield select(walletSelectors.getAccount)
  console.log("start watching for events")
  // start event listener
  yield call(kleros.watchForEvents, account)

  // update storage on validity of token
  yield put(
    action(
      authActions.token.RECEIVE_UPDATED,
      {
        [authActions.token.self] : { isValid: true }
      }
    )
  )
}

function* logOutUser() {
  console.log("stop watching for events")
  // stop event listener
  yield call(kleros.stopWatchingForEvents)

  // redirect to login
  yield put(push('/login'))

  // update storage on validity of token
  yield put(
    action(
      authActions.token.RECEIVE_UPDATED,
      {
        [authActions.token.self] : { isValid: false }
      }
    )
  )
}

/**
 * The root of the notification saga.
 */
export default function* authSaga() {
  // Listeners
  yield fork(setToken)

  yield takeLatest(
    authActions.token.FETCH,
    newAuthToken
  )

  yield takeLatest(
    authActions.token.INVALID,
    logOutUser
  )

  yield takeLatest(
    authActions.token.VALID,
    logInUser
  )
}
