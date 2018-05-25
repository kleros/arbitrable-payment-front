import { createActions } from 'lessdux'

export const token = {
  ...createActions('TOKEN', { withUpdate: true }),
  VALIDATE: 'VALIDATE_TOKEN'
}

export const fetchNewAuthToken = () => ({ type: token.FETCH })
export const validateToken = () => ({ type: token.VALIDATE })
