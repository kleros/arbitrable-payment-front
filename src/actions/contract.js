import { createActions } from 'lessdux'

/* Actions */

// Arbitrator
export const arbitrator = createActions('ARBITRATOR')

// Contracts
export const contracts = createActions('CONTRACTS')

// Contract
export const contract = {
  ...createActions('CONTRACT', {
    withCreate: true
  })
}

// Dispute
export const dispute = {
  ...createActions('DISPUTE', {
    withCreate: true
  })
}

// Pay
export const pay = {
  ...createActions('PAY', {
    withCreate: true
  })
}

// Reimburse
export const reimburse = {
  ...createActions('REIMBURSE', {
    withCreate: true
  })
}

// Tiemout
export const timeout = {
  ...createActions('TIMEOUT', {
    withCreate: true
  })
}

// Evidence
export const evidence = {
  ...createActions('EVIDENCE', {
    withCreate: true
  })
}

// Appeal
export const appeal = {
  ...createActions('APPEAL', {
    withCreate: true
  })
}

/* Action Creators */

// Arbitrator
export const fetchArbitrator = () => ({
  type: arbitrator.FETCH
})

// Contracts
export const fetchContracts = () => ({ type: contracts.FETCH })

// Contract
export const createContract = contractReceived => ({
  type: contract.CREATE,
  payload: { contractReceived }
})

export const fetchContract = arbitrableTransactionId => ({
  type: contract.FETCH,
  payload: { arbitrableTransactionId }
})

// Dispute
export const fetchDispute = disputeId => ({
  type: dispute.FETCH,
  payload: { disputeId }
})

export const createDispute = contractAddress => ({
  type: dispute.CREATE,
  payload: { contractAddress }
})

// Pay
export const createPay = (arbitrableTransactionId, partyA) => ({
  type: pay.CREATE,
  payload: { arbitrableTransactionId, partyA }
})

// Reimburse
export const createReimburse = (contractAddress, partyA, partyB) => ({
  type: reimburse.CREATE,
  payload: { contractAddress, partyA, partyB }
})

// Tiemout
export const createTimeout = (contractAddress, partyA, partyB) => ({
  type: timeout.CREATE,
  payload: { contractAddress, partyA, partyB }
})

// Evidence
export const createEvidence = evidence => ({
  type: evidence.CREATE,
  payload: { evidence }
})

// Appeal
export const createAppeal = contractAddress => ({
  type: appeal.CREATE,
  payload: { contractAddress }
})
