import unit from 'ethjs-unit'
import { push } from 'react-router-redux'
import { toastr } from 'react-redux-toastr'

import { call, put, takeLatest, select } from 'redux-saga/effects'

import * as walletSelectors from '../reducers/wallet'
import {
  kleros,
  web3,
  ARBITRATOR_ADDRESS,
  ARBITRABLE_ADDRESS,
  multipleArbitrableTransactionEth
} from '../bootstrap/dapp-api'
import * as contractActions from '../actions/contract'
import * as errorConstants from '../constants/errors'
import { lessduxSaga } from '../utils/saga'
import { createMetaEvidence } from '../utils/contract'

const toastrOptions = {
  timeOut: 3000,
  showCloseButton: false
}

/**
 * Creates a new contract.
 * @param {object} { payload: contractReceived } - The contract to create.
 */
function* createContract({ type, payload: { contractReceived } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Set contract instance
  yield call(kleros.arbitrable.setContractInstance, ARBITRABLE_ADDRESS)

  const metaEvidence = createMetaEvidence(
    accounts[0],
    contractReceived.partyB,
    contractReceived.title,
    contractReceived.description,
    contractReceived.fileURI
  )

  yield put(push('/'))

  // FIXME transaction hash return
  let transactionHash = null
  try {
    // static method
    transactionHash = yield call(
      kleros.arbitrable.createArbitrableTransaction,
      accounts[0].toLowerCase(),
      ARBITRATOR_ADDRESS,
      contractReceived.partyB.toLowerCase(),
      unit.toWei(contractReceived.payment, 'ether'),
      process.env.REACT_APP_ARBITRATOR_EXTRADATA,
      contractReceived.fileURI // FIXME test
    )
  } catch (err) {
    console.log(err)
  }

  return yield call(fetchContract, {
    payload: { contractAddress: transactionHash } // FIXME test
  })
}

/**
 * Fetches contracts for the current user and puts them in the store.
 */
function* fetchContracts() {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  const arbitrableTransactionIds = yield call(
    multipleArbitrableTransactionEth.methods.getTransactionIDsByAddress(
      accounts[0]
    ).call
  )

  let arbitrableTransactions = []
  for (let arbitrableTransactionId of arbitrableTransactionIds) {
    const arbitrableTransaction = yield call(
      multipleArbitrableTransactionEth.methods.transactions(
        arbitrableTransactionId
      ).call
    )

    arbitrableTransaction.arbitrableTransactionId = arbitrableTransactionId

    arbitrableTransactions.push(arbitrableTransaction)
  }

  return arbitrableTransactions.reverse()
}

/**
 * Fetches contract details.
 * @param {object} { payload: contractAddress } - The address of the contract to fetch details for.
 */
function* fetchContract({ payload: { contractAddress } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Set contract instance
  yield call(kleros.arbitrable.setContractInstance, contractAddress)

  let contract = null
  let rulingData = null
  let currentSession = null
  let disputeData = null

  try {
    contract = yield call(kleros.arbitrable.getData, accounts[0].toLowerCase())

    disputeData = yield call(kleros.arbitrator.getDispute, contract.disputeId)

    if (contract.status === 4)
      rulingData = yield call(
        kleros.arbitrator.currentRulingForDispute,
        contract.disputeId,
        disputeData.numberOfAppeals
      )

    currentSession = yield call(kleros.arbitrator.getSession)
  } catch (err) {
    console.log(err)
  }

  return {
    ruling: rulingData,
    canAppeal:
      disputeData.firstSession + disputeData.numberOfAppeals ===
        currentSession || false,
    ...disputeData,
    ...contract
  }
}

/**
 * Pay the party B. To be called when the good is delivered or the service rendered.
 * @param {object} { payload: contractAddress, partyA, partyB } - The address of the contract.
 */
function* createPay({ type, payload: { contractAddress, partyA, partyB } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Set contract instance
  yield call(kleros.arbitrable.setContractInstance, contractAddress)

  let payTx = null

  try {
    if (partyA !== accounts[0].toLowerCase()) throw new Error('The caller must be the partyA')

    const contract = yield call(kleros.arbitrable.loadContract)

    // TODO get the amount from the api
    const amount = yield call(contract.amount.call)

    if (amount.toNumber() === 0)
      throw new Error('The dispute is already finished')

    payTx = yield call(contract.pay, {
      from: accounts[0]
    })
  } catch (err) {
    console.log(err)
    toastr.error('Pay transaction failed', toastrOptions)
    throw new Error('Error pay transaction')
  }

  yield put(push('/'))
  yield call(toastr.success, 'Payment successful', toastrOptions)

  return payTx
}

/**
 * Reimburse party A. To be called if the good or service can't be fully provided.
 * @param {object} { payload: contractAddress } - The address of the contract.
 */
function* createReimburse({ type, payload: { contractAddress } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Set contract instance
  yield call(kleros.arbitrable.setContractInstance, contractAddress)

  let reimburseTx = null

  try {
    const contract = yield call(kleros.arbitrable.loadContract)

    // TODO get the amount from the api
    const amount = yield call(contract.amount.call)

    if (amount.toNumber() === 0)
      throw new Error('The dispute is already finished')

    // TODO add fn reimburse in the api
    /**
    const reimburseTx = yield call(contract.reimburse, amount.Number(), {
      from: accounts[0]
    })
     */
  } catch (err) {
    console.log(err)
    toastr.error('Reimburse failed', toastrOptions)
    throw new Error('Error reimburse failed')
  }

  yield put(push('/'))
  yield call(toastr.success, 'Successful refund', toastrOptions)

  return reimburseTx
}

/**
 * Raises dispute.
 * @param {object} { payload: contractAddress } - The address of the contract.
 */
function* createDispute({ payload: { contractAddress } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Set contract instance
  yield call(kleros.arbitrable.setContractInstance, contractAddress)

  let contract, disputeTx

  try {
    contract = yield call(kleros.arbitrable.getData, accounts[0].toLowerCase())

    let fee
    if (contract.partyA === accounts[0].toLowerCase()) fee = contract.partyAFee
    if (contract.partyB === accounts[0].toLowerCase()) fee = contract.partyBFee

    const arbitrationCost = yield call(
      kleros.arbitrator.getArbitrationCost,
      contract.arbitratorExtraData
    )

    const cost = arbitrationCost - fee

    if (accounts[0].toLowerCase() === contract.partyA) {
      disputeTx = yield call(
        kleros.arbitrable.payArbitrationFeeByPartyA,
        accounts[0],
        cost
      )
    } else if (accounts[0].toLowerCase() === contract.partyB) {
      disputeTx = yield call(
        kleros.arbitrable.payArbitrationFeeByPartyB,
        accounts[0],
        cost
      )
    }
  } catch (err) {
    console.log(err)
    toastr.error('Create dispute failed', toastrOptions)
    throw new Error('Error create dispute failed')
  }

  yield put(push('/'))
  yield call(toastr.success, 'Dispute creation successful', toastrOptions)

  return disputeTx
}

/**
 * Raises an appeal.
 * @param {object} { payload: contractAddress } - The address of the contract.
 */
function* createAppeal({ type, payload: { contractAddress, disputeId } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  let raiseAppealByPartyATxObj

  try {
    // Set contract instance
    yield call(kleros.arbitrable.setContractInstance, contractAddress)

    const contract = yield call(
      kleros.arbitrable.getData,
      accounts[0].toLowerCase()
    )

    const appealCost = yield call(
      kleros.arbitrator.getAppealCost,
      0,
      contract.arbitratorExtraData
    )

    // raise appeal party A
    raiseAppealByPartyATxObj = yield call(
      kleros.arbitrable.appeal,
      accounts[0].toLowerCase(),
      contract.arbitratorExtraData,
      appealCost
    )
  } catch (err) {
    console.log(err)
    toastr.error('Create appeal failed', toastrOptions)
    throw new Error('Error create appeal failed')
  }

  yield put(push('/'))
  yield call(toastr.success, 'Appeal creation successful', toastrOptions)

  return raiseAppealByPartyATxObj
}

/**
 * Call by PartyA to be to reimburse if partyB fails to pay the fee.
 * @param {object} { payload: contractAddress, partyA, partyB } - The address of the contract.
 */
function* createTimeout({
  type,
  payload: { contractAddress, partyA, partyB }
}) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  yield put(push('/'))

  let timeoutTx = null

  try {
    const contract = yield call(kleros.arbitrable.loadContract)

    // TODO get the amount from the api
    const amount = yield call(contract.amount.call)

    if (amount.toNumber() === 0)
      throw new Error('The dispute is already finished')

    if (partyA === accounts[0].toLowerCase()) {
      timeoutTx = yield call(contract.timeOutByPartyA, {
        from: accounts[0]
      })
    } else if (partyB === accounts[0].toLowerCase()) {
      timeoutTx = yield call(contract.timeOutByPartyB, {
        from: accounts[0]
      })
    }
  } catch (err) {
    console.log(err)
    toastr.error('Timeout failed', toastrOptions)
    throw new Error('Error timeout failed')
  }

  yield call(toastr.success, 'Timeout successful', toastrOptions)

  return timeoutTx
}

/**
 * Send evidence
 * @param {object} { payload: evidence } - Evidence.
 */
function* createEvidence({ type, payload: { evidence } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  yield put(push('/'))

  let evidenceTx = null

  try {
    evidenceTx = yield call(
      kleros.arbitrable.submitEvidence,
      accounts[0].toLowerCase(),
      evidence.name,
      evidence.description,
      evidence.url
    )

    // notification send evidence in waiting
  } catch (err) {
    console.log(err)
    toastr.error('Evidence creation failed', toastrOptions)
    throw new Error('Error evidence creation failed')
  }

  yield call(toastr.success, 'Evidence creation successful', toastrOptions)

  return evidenceTx
}

/**
 * Fetches dispute details.
 * @param {object} { payload: contractAddress, disouteId } - The address of the contract and the dispute id to fetch details for.
 */
function* fetchDispute({ payload: { disputeId } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  let dispute = null

  try {
    dispute = yield call(kleros.arbitrator.getDispute, disputeId)
  } catch (err) {
    console.log(err)
  }

  return dispute
}

/**
 * Fetches the arbitrator's data.
 */
export function* fetchArbitratorData() {
  const arbitratorData = yield call(kleros.arbitrator.getData)

  return arbitratorData
}

/**
 * The root of the wallet saga.
 * @export default walletSaga
 */
export default function* walletSaga() {
  yield takeLatest(
    contractActions.arbitrator.FETCH,
    lessduxSaga,
    'fetch',
    contractActions.arbitrator,
    fetchArbitratorData
  )
  yield takeLatest(
    contractActions.contract.CREATE,
    lessduxSaga,
    'create',
    contractActions.contract,
    createContract
  )
  yield takeLatest(
    contractActions.contracts.FETCH,
    lessduxSaga,
    'fetch',
    contractActions.contracts,
    fetchContracts
  )
  yield takeLatest(
    contractActions.contract.FETCH,
    lessduxSaga,
    'fetch',
    contractActions.contract,
    fetchContract
  )
  yield takeLatest(
    contractActions.dispute.CREATE,
    lessduxSaga,
    'create',
    contractActions.dispute,
    createDispute
  )
  yield takeLatest(
    contractActions.dispute.FETCH,
    lessduxSaga,
    'fetch',
    contractActions.dispute,
    fetchDispute
  )
  yield takeLatest(
    contractActions.appeal.CREATE,
    lessduxSaga,
    'create',
    contractActions.appeal,
    createAppeal
  )
  yield takeLatest(
    contractActions.pay.CREATE,
    lessduxSaga,
    'create',
    contractActions.pay,
    createPay
  )
  yield takeLatest(
    contractActions.reimburse.CREATE,
    lessduxSaga,
    'create',
    contractActions.reimburse,
    createReimburse
  )
  yield takeLatest(
    contractActions.evidence.CREATE,
    lessduxSaga,
    'create',
    contractActions.evidence,
    createEvidence
  )
  yield takeLatest(
    contractActions.timeout.CREATE,
    lessduxSaga,
    'create',
    contractActions.timeout,
    createTimeout
  )
}
