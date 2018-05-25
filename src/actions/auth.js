import { createActions } from 'lessdux'

export const token = {
  ...createActions('TOKEN', { withUpdate: true }),
  INVALID: 'TOKEN_INVALID',
  VALID: 'TOKEN_VALID'
}

export const fetchNewAuthToken = () => ({ type: token.FETCH })
