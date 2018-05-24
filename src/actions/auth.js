export const FETCH_NEW_TOKEN = 'FETCH_NEW_TOKEN'
export const RECEIVE_NEW_TOKEN = 'RECEIVE_NEW_TOKEN'
export const VALIDATE_AUTH_TOKEN = 'VALIDATE_AUTH_TOKEN'
export const RECEIVE_VALIDATE_AUTH_TOKEN = 'RECEIVE_VALIDATE_AUTH_TOKEN'

export const fetchNewToken = () => ({
  type: FETCH_NEW_TOKEN
})

export const receiveNewToken = unsignedToken => ({
  type: RECEIVE_NEW_TOKEN,
  payload: { unsignedToken }
})

export const validateToken = () => ({
  type: VALIDATE_AUTH_TOKEN
})

export const receiveTokenValidation = isValid => ({
  type: RECEIVE_VALIDATE_AUTH_TOKEN,
  payload: { isValid }
})
