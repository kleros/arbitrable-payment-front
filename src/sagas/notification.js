import { eventChannel } from 'redux-saga'

import { fork, call, take } from 'redux-saga/effects'

import { kleros, eth } from '../bootstrap/dapp-api'
import * as authActions from '../actions/auth'

/**
 * Listens for push notifications.
 */
function* pushNotificationsListener() {
  // Start after fetching all notifications
  while (yield take(authActions.FETCH_NEW_TOKEN)) {
    const accounts = yield call(eth.accounts) // Current account
    const account = accounts[0]

    // Set up event channel with subscriber
    const channel = eventChannel(emitter => {
      kleros.watchForEvents(account, notification => emitter(notification))

      return kleros.stopWatchingForEvents // Unsubscribe function
    })

    // Keep listening while on the same account
    // NOTE add notification handler here
    while (account === (yield call(eth.accounts))[0]) {}

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
