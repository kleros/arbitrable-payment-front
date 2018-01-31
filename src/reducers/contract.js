import PropTypes from 'prop-types'

import createReducer from '../utils/create-reducer'
import { createShape } from '../utils/react-redux'

// Reducer
export default createReducer({
  contract: {
    loading: false,
    data: null,
    failedLoading: false
  },
  contracts: {
    loading: false,
    data: null,
    failedLoading: false
  }
})

// Selectors
export const createContract = state => state.contract.contract.data

// Shapes
export const contractShape = PropTypes.shape({
  address: PropTypes.string,
  arbitrator: PropTypes.string,
  description: PropTypes.string,
  disputeId: PropTypes.number,
  email: PropTypes.string,
  evidencePartyA: PropTypes.string,
  evidencePartyB: PropTypes.string,
  evidences: PropTypes.arrayOf(
    PropTypes.shape({ _id: PropTypes.string, url: PropTypes.string })
  ),
  partyB: PropTypes.string,
  timeout: PropTypes.number,
  _id: PropTypes.string
})
