import PropTypes from 'prop-types'

import createReducer from '../utils/create-reducer'
import { createShape } from '../utils/react-redux'

// Reducer
export default createReducer({
  tokenValid: {
    loading: false,
    data: null,
    failedLoading: false
  },
  authToken: {
    loading: false,
    data: null,
    failedLoading: false
  }
})

// Shapes
export const tokenValidShape = createShape(PropTypes.bool)
export const authTokenShape = createShape(PropTypes.string)
