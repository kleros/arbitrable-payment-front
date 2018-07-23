import { eventChannel } from 'redux-saga'

import { fork, call, take } from 'redux-saga/effects'

import { kleros, web3 } from '../bootstrap/dapp-api'
import * as authActions from '../actions/auth'
import * as errorConstants from '../constants/errors'

/**
 * Listens for push notifications.
 */
function* pushNotificationsListener() {
  // Start after fetching all notifications
  while (yield take(authActions.FETCH_NEW_TOKEN)) {
    const accounts = yield call(web3.eth.getAccounts)
    if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

    const account = accounts[0]

    // Set up event channel with subscriber
    const channel = eventChannel(emitter => {
      kleros.watchForEvents(accounts[0], notification => emitter(notification))

      return kleros.stopWatchingForEvents // Unsubscribe function
    })

    // Keep listening while on the same account
    // NOTE add notification handler here
    while (account === (yield call(web3.eth.getAccounts))[0]) {}

    // We changed accounts, so close the channel. This calls unsubscribe under the hood which clears handlers for the old account
    channel.close()
  }
}

/**
 * The root of the notification saga.
 */
export default function* notificationSaga() {
  // Listeners
  yield fork(pushNotificationsListener)
}
