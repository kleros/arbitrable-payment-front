// Actions
export const FETCH_CONTRACT = 'FETCH_CONTRACT'
export const CREATE_CONTRACT = 'CREATE_CONTRACT'
export const RECEIVE_CONTRACT = 'RECEIVE_CONTRACT'
export const FETCH_CONTRACTS = 'FETCH_CONTRACTS'
export const RECEIVE_CONTRACTS = 'RECEIVE_CONTRACTS'
export const CREATE_DISPUTE = 'CREATE_DISPUTE'
export const RECEIVE_DISPUTE = 'RECEIVE_DISPUTE'
export const CREATE_PAY = 'CREATE_PAY'
export const RECEIVE_PAY = 'RECEIVE_PAY'
export const CREATE_EVIDENCE = 'CREATE_EVIDENCE'
export const RECEIVE_EVIDENCE = 'RECEIVE_EVIDENCE'

// Action Creators
export const createContract = contract => ({
  type: CREATE_CONTRACT,
  payload: { contract }
})
export const fetchContracts = () => ({ type: FETCH_CONTRACTS })
export const receiveContracts = contracts => ({
  type: RECEIVE_CONTRACTS,
  payload: { contracts }
})
export const fetchContract = contractAddress => ({
  type: FETCH_CONTRACT,
  payload: { contractAddress }
})
export const receiveContract = contract => ({
  type: RECEIVE_CONTRACT,
  payload: { contract }
})

export const createDispute = contractAddress => ({
  type: CREATE_DISPUTE,
  payload: { contractAddress }
})
export const receiveDispute = disputeTx => ({
  type: RECEIVE_DISPUTE,
  payload: { disputeTx }
})
export const createPay = contractAddress => ({
  type: CREATE_PAY,
  payload: { contractAddress }
})
export const receivePay = disputeTx => ({
  type: RECEIVE_PAY,
  payload: { disputeTx }
})
export const createEvidence = evidence => ({
  type: CREATE_EVIDENCE,
  payload: { evidence }
})
export const receiveEvidence = evidence => ({
  type: RECEIVE_EVIDENCE,
  payload: { evidence }
})
