export const getAuthTokens = () => {
  const storage = window.localStorage
  return storage.getItem('auth')
    ? JSON.parse(storage.getItem('auth'))
    : {}
}

export const getAuthTokenForAccount = (account) => {
  const _authTokens = getAuthTokens()
  return _authTokens[account]
}

export const saveAuthTokenForAccount = (token, account) => {
  const storage = window.localStorage
  const _authTokens = getAuthTokens()
  // set new token
  _authTokens[account] = token
  // save tokens object
  storage.setItem('auth', JSON.stringify(_authTokens))
}
