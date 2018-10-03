import unit from 'ethjs-unit'
import { push } from 'react-router-redux'
import { toastr } from 'react-redux-toastr'

import { call, put, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'

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

import storeApi from './api/store'

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

  const metaEvidence = createMetaEvidence(
    accounts[0],
    contractReceived.partyB,
    contractReceived.title,
    contractReceived.description,
    contractReceived.fileURI
  )

  yield put(push('/'))

  let arbitrableTransactionCount

  try {
    // Upload the meta-evidence then return an url
    const file = yield call(storeApi.postFile, JSON.stringify(metaEvidence))

    // Set contract instance
    yield call(kleros.arbitrable.setContractInstance, ARBITRABLE_ADDRESS)

    yield call(
      kleros.arbitrable.createArbitrableTransaction,
      accounts[0],
      ARBITRATOR_ADDRESS,
      contractReceived.partyB,
      unit.toWei(contractReceived.payment, 'ether'),
      undefined,
      process.env.REACT_APP_ARBITRATOR_EXTRADATA,
      file.payload.fileURL
    )

    arbitrableTransactionCount = yield call(
      multipleArbitrableTransactionEth.methods.getCountTransactions().call
    )
  } catch (err) {
    console.log(err)
  }

  localStorage.setItem(
    'arbitrableTransactionId',
    arbitrableTransactionCount - 1
  )
  localStorage.setItem('arbitrableTransactionTitle', contractReceived.title)
  localStorage.setItem(
    'arbitrableTransactionDescription',
    contractReceived.description
  )

  yield call(toastr.success, 'Arbitrable transaction created', toastrOptions)

  return yield call(fetchContract, {
    payload: { arbitrableTransactionId: arbitrableTransactionCount - 1 }
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

  // Set contract instance
  yield call(kleros.arbitrable.setContractInstance, ARBITRABLE_ADDRESS)

  for (let arbitrableTransactionId of arbitrableTransactionIds) {
    const arbitrableTransaction = yield call(
      kleros.arbitrable.getData,
      arbitrableTransactionId
    )

    arbitrableTransaction.arbitrableTransactionId = arbitrableTransactionId

    arbitrableTransactions.push(arbitrableTransaction)
  }

  return arbitrableTransactions.reverse()
}

/**
 * Fetches contract details.
 * @param {object} { payload: arbitrableTransactionId } - The address of the contract to fetch details for.
 */
function* fetchContract({ payload: { arbitrableTransactionId } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  let arbitrableTransaction
  let ruling = null
  let currentSession = null
  let disputeData = null
  let canAppeal = null

  try {
    arbitrableTransaction = yield call(
      kleros.arbitrable.getData,
      arbitrableTransactionId
    )

    arbitrableTransaction.arbitrableTransactionId = arbitrableTransactionId

    console.log('arbitrableTransaction', arbitrableTransaction)

    disputeData = yield call(
      kleros.arbitrator.getDispute,
      arbitrableTransaction.disputeId
    )

    if (arbitrableTransaction.status === 4)
      ruling = yield call(
        kleros.arbitrator.currentRulingForDispute,
        arbitrableTransaction.disputeId,
        disputeData.numberOfAppeals
      )

    currentSession = yield call(kleros.arbitrator.getSession)
  } catch (err) {
    console.log(err)
  }

  if (disputeData) {
    canAppeal =
      disputeData.firstSession + disputeData.numberOfAppeals === currentSession
  } else {
    canAppeal = false
  }

  return {
    ruling,
    canAppeal,
    ...disputeData,
    ...arbitrableTransaction
  }
}

/**
 * Pay the party B. To be called when the good is delivered or the service rendered.
 * @param {object} { payload: contractAddress, partyA, partyB } - The address of the contract.
 */
function* createPay({ type, payload: { arbitrableTransactionId } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Set contract instance
  yield call(kleros.arbitrable.setContractInstance, ARBITRABLE_ADDRESS)

  let payTx = null

  try {
    const arbitrableTransaction = yield call(
      kleros.arbitrable.getData,
      arbitrableTransactionId
    )

    const amount = arbitrableTransaction.amount

    if (amount === 0) throw new Error('The dispute is already finished')

    payTx = yield call(
      kleros.arbitrable.pay,
      accounts[0],
      arbitrableTransactionId,
      amount
    )
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
function* createReimburse({ type, payload: { arbitrableTransactionId } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Set contract instance
  yield call(kleros.arbitrable.setContractInstance, ARBITRABLE_ADDRESS)

  let reimburseTx = ''

  try {
    const arbitrableTransaction = yield call(
      kleros.arbitrable.getData,
      arbitrableTransactionId
    )

    const amount = arbitrableTransaction.amount

    if (amount === 0) throw new Error('The dispute is already finished')

    reimburseTx = yield call(
      kleros.arbitrable.reimburse,
      accounts[0],
      arbitrableTransactionId,
      amount
    )
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
function* createDispute({ payload: { arbitrableTransactionId } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Set contract instance
  yield call(kleros.arbitrable.setContractInstance, ARBITRABLE_ADDRESS)

  let disputeTx = ''

  try {
    const arbitrableTransaction = yield call(
      kleros.arbitrable.getData,
      arbitrableTransactionId
    )

    let fee
    if (arbitrableTransaction.buyer === accounts[0].toLowerCase())
      fee = arbitrableTransaction.buyerFee
    if (arbitrableTransaction.seller === accounts[0].toLowerCase())
      fee = arbitrableTransaction.sellerFee

    const arbitrationCost = yield call(
      kleros.arbitrator.getArbitrationCost,
      arbitrableTransaction.arbitratorExtraData
    )

    const cost = arbitrationCost - fee

    if (accounts[0].toLowerCase() === arbitrableTransaction.buyer) {
      disputeTx = yield call(
        kleros.arbitrable.payArbitrationFeeByBuyer,
        accounts[0],
        arbitrableTransactionId,
        cost
      )
    } else if (accounts[0].toLowerCase() === arbitrableTransaction.seller) {
      disputeTx = yield call(
        kleros.arbitrable.payArbitrationFeeBySeller,
        accounts[0],
        arbitrableTransactionId,
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
function* createAppeal({ type, payload: { arbitrableTransactionId, disputeId } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Set contract instance
  yield call(kleros.arbitrable.setContractInstance, ARBITRABLE_ADDRESS)

  let raiseAppealByPartyATxObj

  try {
    // Set contract instance
    const arbitrableTransaction = yield call(
      kleros.arbitrable.getData,
      arbitrableTransactionId
    )

    const appealCost = yield call(
      kleros.arbitrator.getAppealCost,
      disputeId,
      arbitrableTransactionId.arbitratorExtraData
    )

    // raise appeal party A
    raiseAppealByPartyATxObj = yield call(
      kleros.arbitrable.appeal,
      accounts[0],
      arbitrableTransactionId,
      arbitrableTransaction.arbitratorExtraData,
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
  payload: { arbitrableTransactionId, buyer, seller }
}) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Set contract instance
  yield call(kleros.arbitrable.setContractInstance, ARBITRABLE_ADDRESS)

  yield put(push('/'))

  let timeoutTx = null

  try {
    // Set contract instance
    const arbitrableTransaction = yield call(
      kleros.arbitrable.getData,
      arbitrableTransactionId
    )

    if (arbitrableTransaction.amount === 0)
      throw new Error('The dispute is already finished')

    if (buyer === accounts[0].toLowerCase()) {
      timeoutTx = yield call(
        kleros.arbitrable.callTimeOutBuyer,
        accounts[0],
        arbitrableTransactionId
      )
    } else if (seller === accounts[0].toLowerCase()) {
      timeoutTx = yield call(
        kleros.arbitrable.callTimeOutSeller,
        accounts[0],
        arbitrableTransactionId
      )
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
 * @param {object} { type, payload: evidenceReceived } - Evidence.
 */
function* createEvidence({ type, payload: { evidenceReceived } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  yield put(push('/'))

  let evidenceTx = null

  try {
    // Upload the evidence then return an url
    const file = yield call(
      storeApi.postFile,
      JSON.stringify({
        name: evidenceReceived.name,
        description: evidenceReceived.description,
        url: evidenceReceived.url
      })
    )

    // Set contract instance
    yield call(kleros.arbitrable.setContractInstance, ARBITRABLE_ADDRESS)

    evidenceTx = yield call(
      multipleArbitrableTransactionEth.methods.submitEvidence(
        evidenceReceived.arbitrableTransactionId,
        file.payload.fileURL
      ).send,
      {
        from: accounts[0],
        value: 0
      }
    )
  } catch (err) {
    console.log(err)
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
