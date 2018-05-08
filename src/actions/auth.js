export const FETCH_NEW_TOKEN = 'FETCH_NEW_TOKEN'
export const RECEIVE_NEW_TOKEN = 'RECEIVE_NEW_TOKEN'

export const fetchNewToken = () => ({
  type: FETCH_NEW_TOKEN
})

export const receiveNewToken = unsignedToken => ({
  type: RECEIVE_NEW_TOKEN,
  payload: { unsignedToken }
})
