import { takeLatest, select, call } from 'redux-saga/effects'

import * as walletSelectors from '../reducers/wallet'
import * as walletActions from '../actions/wallet'
import { lessduxSaga } from '../utils/saga'
import { web3 } from '../bootstrap/dapp-api'
import * as errorConstants from '../constants/errors'

/**
 * Fetches the current wallet's accounts.
 * @returns {string[]} - The accounts.
 */
function* fetchAccounts() {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  return accounts
}

/**
 * Fetches the current wallet's ethereum balance.
 * @returns {string} - The balance.
 */
function* fetchBalance() {
  const balance = yield call(
    web3.eth.getBalance,
    yield select(walletSelectors.getAccount)
  )

  return String(balance)
}

/**
 * The root of the wallet saga.
 */
export default function* walletSaga() {
  // Accounts
  yield takeLatest(
    walletActions.accounts.FETCH,
    lessduxSaga,
    'fetch',
    walletActions.accounts,
    fetchAccounts
  )

  // Balance
  yield takeLatest(
    walletActions.balance.FETCH,
    lessduxSaga,
    'fetch',
    walletActions.balance,
    fetchBalance
  )
}