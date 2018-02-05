import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Blockies from 'react-blockies'

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

  shortAddress = address => {
    const startAddress = address.substr(0, address.length-36)
    const endAddress = address.substr(37)

    return `${startAddress}...${endAddress}`
  }

  render() {
    const { loadingContract, contract } = this.props

    return (
      <div>
        {renderIf(
          [contract.loading],
          [contract.data && contract.data.partyAFee],
          [contract.failedLoading],
          {
            loading: <span>loading</span>,
            done: contract.data && (
              <div className="Contract">
                <div className="Contract-content">
                  <div className="Contract-content-address">
                    <div><Blockies seed={contract.data.address} size={6} scale={10} bgColor="#f5f5f5" /></div>
                    <div className="Contract-content-address-address">{this.shortAddress(contract.data.address)}</div>
                  </div>
                  {console.log(contract.data)}
                  <div className="partyB">
                    <div className="identicon">
                      <Blockies seed={contract.data.partyA} size={5} scale={4} bgColor="#f5f5f5" />
                    </div>
                    <div className="content">
                      {this.shortAddress(contract.data.partyA)}
                    </div>

                    <div>&nbsp;&nbsp;</div>

                    <div className="identicon">
                      <Blockies seed={contract.data.partyB} size={5} scale={4} bgColor="#f5f5f5" />
                    </div>

                    <div className="content">
                      {this.shortAddress(contract.data.partyB)}
                    </div>

                  </div>

                  <div>Status: {contract.data.status}</div>
                  <div>Mail: {contract.data.email}</div>
                  <div className="description">{contract.data.description}</div>

                  {!contract.data.partyAFee && !contract.data.partyBFee ?
                    <div className="Contract-actions">
                      <div className="Contract-actions-button Contract-actions-button-left" onClick={this.createDispute}>Create dispute</div>
                      <div className="Contract-actions-button Contract-actions-button-right" onClick={this.createPay}>Pay</div>
                    </div>
                    :
                    <div>
                      Waiting pay from the other party
                    </div>
                  }
                </div>
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
