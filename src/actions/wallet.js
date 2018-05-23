// Actions
export const FETCH_ACCOUNTS = 'FETCH_ACCOUNTS'
export const RECEIVE_ACCOUNTS = 'RECEIVE_ACCOUNTS'
export const FAIL_FETCH_ACCOUNTS = 'FAIL_FETCH_ACCOUNTS'
export const FETCH_BALANCE = 'FETCH_BALANCE'
export const RECEIVE_BALANCE = 'RECEIVE_BALANCE'
export const FAIL_FETCH_BALANCE = 'FAIL_FETCH_BALANCE'
export const FETCH_VERSION = 'FETCH_VERSION'
export const RECEIVE_VERSION = 'RECEIVE_VERSION'
export const FAIL_FETCH_VERSION = 'FAIL_FETCH_VERSION'

// Action Creators
export const fetchAccounts = () => ({ type: FETCH_ACCOUNTS })
// Accounts
export const receiveAccounts = _accounts => ({
  type: RECEIVE_ACCOUNTS,
  payload: { accounts: _accounts }
})
export const fetchBalance = () => ({ type: FETCH_BALANCE })
export const fetchVersion = () => ({ type: FETCH_VERSION })
