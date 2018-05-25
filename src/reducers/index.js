import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as form } from 'redux-form'
import { reducer as toastr } from 'react-redux-toastr'

import wallet from './wallet'
import contract from './contract'
import auth from './auth'

// Export root reducer
export default combineReducers({
  router,
  form,
  toastr,
  wallet,
  contract,
  auth
})
