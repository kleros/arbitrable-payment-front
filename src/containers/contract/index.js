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
    fetchContract: PropTypes.func.isRequired,
    createDispute: PropTypes.func.isRequired,
    createPay: PropTypes.func.isRequired,

    // Router
    match: PropTypes.shape({
      params: PropTypes.shape({ contractAddress: PropTypes.string.isRequired })
        .isRequired
    }).isRequired
  }

  componentDidMount() {
    const { match, fetchContract } = this.props
    fetchContract(match.params.contractAddress)
  }

  createDispute = () => {
    const { createDispute, match } = this.props
    createDispute(match.params.contractAddress)
  }

  createPay = () => {
    const { createPay, match } = this.props
    createPay(match.params.contractAddress)
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
                <button onClick={this.createDispute}>Create dispute</button>
                <button onClick={this.createPay}>Pay</button>
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
    dispute: state.contract.dispute,
    pay: state.contract.pay
  }),
  {
    fetchContract: contractActions.fetchContract,
    createDispute: contractActions.createDispute,
    createPay: contractActions.createPay
  }
)(Contract)
