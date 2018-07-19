import { createActions } from 'lessdux'

// Actions
export const FETCH_GETDISPUTE = 'FETCH_GETDISPUTE'
export const CREATE_DISPUTE = 'CREATE_DISPUTE'
export const RECEIVE_DISPUTE = 'RECEIVE_DISPUTE'
export const CREATE_APPEAL = 'CREATE_APPEAL'
export const RECEIVE_APPEAL = 'RECEIVE_APPEAL'
export const CREATE_PAY = 'CREATE_PAY'
export const RECEIVE_PAY = 'RECEIVE_PAY'
export const CREATE_REIMBURSE = 'CREATE_REIMBURSE'
export const RECEIVE_REIMBURSE = 'RECEIVE_REIMBURSE'
export const CREATE_EVIDENCE = 'CREATE_EVIDENCE'
export const RECEIVE_EVIDENCE = 'RECEIVE_EVIDENCE'
export const CREATE_TIMEOUT = 'CREATE_TIMEOUT'
export const RECEIVE_TIMEOUT = 'RECEIVE_TIMEOUT'
export const FETCH_ARBITRATOR = 'FETCH_ARBITRATOR'
export const RECEIVE_ARBITRATOR = 'RECEIVE_ARBITRATOR'

// Action Creators
export const fetchGetDispute = (contractAddress, disputeId) => ({
  type: FETCH_GETDISPUTE,
  payload: { contractAddress, disputeId }
})
export const createDispute = contractAddress => ({
  type: CREATE_DISPUTE,
  payload: { contractAddress }
})
/*
  the dispute param can be a hash if it's a new dispute
  or an object if the dispute exists
  maybe use RECEIVE_CREATED_
*/
export const receiveDispute = dispute => ({
  type: RECEIVE_DISPUTE,
  payload: { dispute }
})
export const createAppeal = contractAddress => ({
  type: CREATE_APPEAL,
  payload: { contractAddress }
})
export const receiveAppeal = appealTx => ({
  type: RECEIVE_APPEAL,
  payload: { appealTx }
})

export const createPay = (contractAddress, partyA, partyB) => ({
  type: CREATE_PAY,
  payload: { contractAddress, partyA, partyB }
})
export const receivePay = disputeTx => ({
  type: RECEIVE_PAY,
  payload: { disputeTx }
})
export const createReimburse = (contractAddress, partyA, partyB) => ({
  type: CREATE_REIMBURSE,
  payload: { contractAddress, partyA, partyB }
})
export const receiveReimburse = reimburse => ({
  type: RECEIVE_REIMBURSE,
  payload: { reimburse }
})
export const createEvidence = evidence => ({
  type: CREATE_EVIDENCE,
  payload: { evidence }
})
export const receiveEvidence = evidence => ({
  type: RECEIVE_EVIDENCE,
  payload: { evidence }
})
export const createTimeout = (contractAddress, partyA, partyB) => ({
  type: CREATE_TIMEOUT,
  payload: { contractAddress, partyA, partyB }
})
export const receiveTimeout = timeout => ({
  type: RECEIVE_TIMEOUT,
  payload: { timeout }
})
export const fetchArbitrator = () => ({
  type: FETCH_ARBITRATOR
})
export const receiveArbitrator = arbitrator => ({
  type: RECEIVE_ARBITRATOR,
  payload: { arbitrator }
})

/* Actions */

// Contracts
export const contracts = createActions('CONTRACTS')

/* Action Creators */

// Contracts
export const fetchContracts = () => ({ type: contracts.FETCH })

// Contract
export const contract = {
  ...createActions('CONTRACT', {
    withCreate: true
  })
}

export const createContract = contract => ({
  type: contract.CREATE,
  payload: { contract }
})

export const fetchContract = contractAddress => ({
  type: contract.FETCH,
  payload: { contractAddress }
})