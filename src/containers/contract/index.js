import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { objMap } from '../../utils/functional'
import * as contractSelectors from '../../reducers/contract'
import * as contractActions from '../../actions/contract'
import { renderIf } from '../../utils/react-redux'

import './contract.css'

class Contract extends PureComponent {
  static propTypes = {
    contract: contractSelectors.contractShape.isRequired,
    dispute: contractSelectors.disputeShape.isRequired,
    fetchContract: PropTypes.func.isRequired,
    createDispute: PropTypes.func.isRequired,

    // Router
    match: PropTypes.shape({
      params: PropTypes.shape({ contractAddress: PropTypes.string.isRequired })
        .isRequired
    }).isRequired
  }

  componentDidMount() {
    const { match, fetchContract, createDispute } = this.props
    fetchContract(match.params.contractAddress)
  }

  render() {
    const { loadingContract, contract } = this.props

    return (
      <div className="container">
        {renderIf(
          [contract.loading],
          [contract.data],
          [contract.failedLoading],
          {
            loading: <span>loading</span>,
            done: (
              <div>
                {objMap(contract, (value, key) => (
                  <div key={key}>
                    {key}: {JSON.stringify(value)}
                  </div>
                ))}
                <button onClick={v => v}>Create dispute</button>
              </div>
            ),
            failed: contract.failedLoading && 'failedLoading contract'
        })}
      </div>
    )
  }
}

export default connect(
  state => ({
    contract: state.contract.contract,
    dispute: state.contract.dispute
  }),
  {
    fetchContract: contractActions.fetchContract,
    createDispute: contractActions.createDispute
  }
)(Contract)
