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

export const createDispute = arbitrableTransactionId => ({
  type: dispute.CREATE,
  payload: { arbitrableTransactionId }
})

// Pay
export const createPay = (arbitrableTransactionId, partyA) => ({
  type: pay.CREATE,
  payload: { arbitrableTransactionId, partyA }
})

// Reimburse
export const createReimburse = arbitrableTransactionId => ({
  type: reimburse.CREATE,
  payload: { arbitrableTransactionId }
})

// Tiemout
export const createTimeout = (arbitrableTransactionId, partyA, partyB) => ({
  type: timeout.CREATE,
  payload: { arbitrableTransactionId, partyA, partyB }
})

// Evidence
export const createEvidence = evidence => ({
  type: evidence.CREATE,
  payload: { evidence }
})

// Appeal
export const createAppeal = arbitrableTransactionId => ({
  type: appeal.CREATE,
  payload: { arbitrableTransactionId }
})
