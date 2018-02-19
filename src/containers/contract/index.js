import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Blockies from 'react-blockies'
import { ClipLoader } from 'react-spinners'
import { push } from 'react-router-redux'

import * as walletActions from '../../actions/wallet'
import { objMap } from '../../utils/functional'
import * as contractSelectors from '../../reducers/contract'
import * as contractActions from '../../actions/contract'
import { renderIf } from '../../utils/react-redux'

import './contract.css'

class Contract extends PureComponent {
  state = {
    party: '',
    partyOther: ''
  }
  static propTypes = {
    contract: contractSelectors.contractShape.isRequired,
    fetchContract: PropTypes.func.isRequired,
    createDispute: PropTypes.func.isRequired,
    createPay: PropTypes.func.isRequired,
    createReimburse: PropTypes.func.isRequired,
    fetchAccounts: PropTypes.func.isRequired,

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

  componentWillReceiveProps(nextProps) {
   const { contract: prevContract } = this.props
   const { contract, accounts } = nextProps
   if (prevContract !== contract) {
     if (
       contract.data &&
       contract.data.partyA.toLowerCase() === accounts.data[0].toLowerCase()
     ) {
       this.setState({ party: 'partyA' })
       this.setState({ partyOther: 'partyB' })
     } else if (
       contract.data &&
       contract.data.partyB.toLowerCase() === accounts.data[0].toLowerCase()
     ) {
       this.setState({ party: 'partyB' })
       this.setState({ partyOther: 'partyA' })
     }
   }
 }

  createDispute = () => {
    const { createDispute, match } = this.props
    createDispute(match.params.contractAddress)
  }

  createPay = () => {
    const { contract, createPay, match } = this.props
    createPay(
      match.params.contractAddress,
      contract.data.partyA,
      contract.data.partyB
    )
  }

  createReimburse = () => {
    const { contract, createReimburse, match } = this.props
    createReimburse(
      match.params.contractAddress,
      contract.data.partyA,
      contract.data.partyB
    )
  }

  timeout = () => {
    const { contract, createTimeout, match } = this.props
    createTimeout(
      match.params.contractAddress,
      contract.data.partyA,
      contract.data.partyB
    )
  }

  shortAddress = address => {
    const startAddress = address.substr(0, address.length-36)
    const endAddress = address.substr(37)

    return `${startAddress}...${endAddress}`
  }

  // TODO go to utils
  redirect = (url, ...args) => {
    if (!args.length) {
      this.props.history.push(url)
    } else {
      const allArgs = args.reduce((acc, arg, url) => (`${acc}/${arg}`))
      this.props.history.push(`${url}/${allArgs}`)
    }
  }

  render() {
    const { loadingContract, contract, accounts } = this.props

    return (
      <div>
        {renderIf(
          [contract.loading],
          [contract.data && contract.data.partyAFee && accounts.data && accounts.data[0]],
          [contract.failedLoading || accounts.failedLoading],
          {
            loading: <div className="loader"><ClipLoader color={'gray'}  loading={true} /></div>,
            done: contract.data && (
              <div className="Contract">
                <div className="Contract-content">
                  <div className="Contract-content-address">
                    <div><Blockies seed={contract.data.address} size={6} scale={10} bgColor="#f5f5f5" /></div>
                    <div className="Contract-content-address-address">{this.shortAddress(contract.data.address)}</div>
                  </div>
                  <div className="Contract-content-partyB">
                    <div className="Contract-content-partyB-identicon">
                      <Blockies seed={contract.data.partyA} size={5} scale={4} bgColor="#f5f5f5" />
                    </div>
                    <div className="Contract-content-partyB-content">
                      {this.shortAddress(contract.data.partyA)}
                    </div>

                    <div>&nbsp;&nbsp;</div>

                    <div className="Contract-content-partyB-identicon">
                      <Blockies seed={contract.data.partyB} size={5} scale={4} bgColor="#f5f5f5" />
                    </div>

                    <div className="Contract-content-partyB-content">
                      {this.shortAddress(contract.data.partyB)}
                    </div>
                  </div>

                  <div className="Contract-content-item Contract-content-item-mail">{contract.data.email}</div>
                  <div className="description Contract-content-item">{contract.data.description}</div>
                  {!contract.data.partyAFee && !contract.data.partyBFee ?
                    <div className="Contract-content-actions">
                      <div className="Contract-content-actions-button Contract-actions-button-left" onClick={this.createDispute}>Create dispute</div>
                      {contract.data.partyA === accounts.data[0] && <div className="Contract-content-actions-button Contract-content-actions-button-right" onClick={this.createPay}>Pay</div>}
                      {contract.data.partyB === accounts.data[0] && <div className="Contract-content-actions-button Contract-content-actions-button-right" onClick={this.createReimburse}>Reimburse</div>}
                    </div>
                    : <div></div>
                  }
                  {!contract.data[`${this.state.party}Fee`] && contract.data[`${this.state.partyOther}Fee`] ?
                    <div>
                      <div className="Contract-content-waiting">
                        The other party raise a dispute.<br/>So as not to lose the dispute you must pay the fee.
                      </div>
                      <div className="Contract-content-actions">
                        <div className="Contract-content-actions-button" onClick={this.createDispute}>Pay the fee</div>
                      </div>
                    </div>
                    : <div></div>
                  }
                  {(Date.now() / 1000 | 0) < (contract.data.lastInteraction.toNumber() + contract.data.timeout) && contract.data[`${this.state.party}Fee`] && !contract.data[`${this.state.partyOther}Fee`] ?
                    <div className="Contract-content-waiting">
                      Waiting pay fee from the other party<br/>({this.shortAddress(contract.data[`${this.state.partyOther}`])})
                    </div>
                    : <div></div>
                  }
                  {(Date.now() / 1000 | 0) >= (contract.data.lastInteraction.toNumber() + contract.data.timeout) && contract.data[`${this.state.party}Fee`] && !contract.data[`${this.state.partyOther}Fee`] ?
                    <div className="Contract-content-actions">
                      <div className="Contract-content-actions-button" onClick={this.timeout}>{`Timeout ${this.state.partyOther}`}</div>
                    </div>
                    : <div></div>
                  }
                  {contract.data.partyAFee && contract.data.partyBFee ?
                    <div className="Contract-content-actions">
                      <div className="Contract-content-actions-button" onClick={() => this.redirect('/evidences/new')}>Send Evidence</div>
                    </div>
                    : <div></div>
                  }
                  {
                    contract.data.evidences.map((evidence, i) =>
                      <div className="Contract-content-evidenceCard" onClick={() => window.location.replace(evidence.url)} key={i}>
                        <div className="Contract-content-evidenceCard-name">{evidence.name}</div>
                        <div className="description">{evidence.description}</div>
                        <div className="Contract-content-evidenceCard-url">{evidence.url}</div>
                      </div>
                    )
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
    pay: state.contract.pay,
    reimburse: state.contract.reimburse,
    timeout: state.contract.timeout,
    accounts: state.wallet.accounts
  }),
  {
    fetchContract: contractActions.fetchContract,
    createDispute: contractActions.createDispute,
    createPay: contractActions.createPay,
    createReimburse: contractActions.createReimburse,
    fetchAccounts: walletActions.fetchAccounts,
    createTimeout: contractActions.createTimeout
  }
)(Contract)
