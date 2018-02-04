import unit from 'ethjs-unit'
import { takeLatest, call, put, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import kleros, { eth } from '../bootstrap/dapp-api'
import * as contractActions from '../actions/contract'
import * as contractSelectors from '../reducers/contract'
import { receiveAction, errorAction } from '../utils/actions'
import { ETH_NO_ACCOUNTS } from '../constants/errors'

/**
 * Creates a new contract.
 * @param {object} { payload: contract } - The contract to create.
 */
function* createContract({type, payload: { contract }}) {
  const accounts = yield call(eth.accounts)
  if (!accounts[0]) throw new Error(ETH_NO_ACCOUNTS)

  yield put(push('/'))

  let newContract = null

  try {
    newContract = yield call(
      kleros.arbitrableContract.deployContract,
      accounts[0].toLowerCase(),
      unit.toWei(contract.payment, 'ether'),
      contract.description,
      process.env.ARBITRATOR_ADDRESS,
      contract.timeout,
      contract.partyB.toLowerCase(),
      contract.arbitratorExtraData,
      contract.email,
      contract.description
    )
  } catch (err) {
    console.log(err)
  }

  yield put(contractActions.receiveContract(newContract))
}

/**
 * Fetches contracts for the current user and puts them in the store.
 */
function* fetchContracts() {
  const accounts = yield call(eth.accounts)
  if (!accounts[0]) throw new Error(ETH_NO_ACCOUNTS)

  let contracts = []

  contracts = yield call(
    kleros.arbitrator.getContractsForUser,
    accounts[0].toLowerCase()
  )

  yield put(contractActions.receiveContracts(contracts.reverse()))
}

/**
 * Fetches contract details.
 * @param {object} { payload: contractAddress } - The address of the contract to fetch details for.
 */
function* fetchContract({ payload: { contractAddress } }) {
  const accounts = yield call(eth.accounts)
  if (!accounts[0]) throw new Error(ETH_NO_ACCOUNTS)

  let contract = null

  try {
    contract = yield call(
      kleros.arbitrableContract.getData,
      contractAddress,
      accounts[0].toLowerCase()
    )
  } catch (err) {
    console.log(err)
  }

  yield put(contractActions.receiveContract(contract))
}

/**
 * The root of the wallet saga.
 * @export default walletSaga
 */
export default function* walletSaga() {
  yield takeLatest(contractActions.CREATE_CONTRACT, createContract),
  yield takeLatest(contractActions.FETCH_CONTRACTS, fetchContracts),
  yield takeLatest(contractActions.FETCH_CONTRACT, fetchContract)
}
