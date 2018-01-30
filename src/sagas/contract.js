import unit from 'ethjs-unit'

import { takeLatest, call, put, select } from 'redux-saga/effects'

import kleros, { eth } from '../bootstrap/dapp-api'
import * as contractActions from '../actions/contract'
import * as contractSelectors from '../reducers/contract'
import { receiveAction, errorAction } from '../utils/actions'
import { ETH_NO_ACCOUNTS } from '../constants/errors'

/**
 * Creates a new contract.
 * @param {object} { payload: contract } - The contract to create.
 */
function* createContract({ payload: { contract } }) {
  const accounts = yield call(eth.accounts)
  if (!accounts[0]) throw new Error(ETH_NO_ACCOUNTS)

  let newContract = null
  if (accounts[0])
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
 * The root of the wallet saga.
 * @export default walletSaga
 */
export default function* walletSaga() {
  yield takeLatest(contractActions.CREATE_CONTRACT, createContract)
}
