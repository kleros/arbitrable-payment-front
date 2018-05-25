import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

// Shapes
const {
  shape: tokenShape,
  initialState: tokenInitialState
} = createResource(PropTypes.shape({
  isValid: PropTypes.bool.isRequired
}), { withUpdate: true })

export { tokenShape }

// default to invalid
tokenInitialState.data = {
  isValid: false
}

// Reducer
export default createReducer({
  token: tokenInitialState,
})
