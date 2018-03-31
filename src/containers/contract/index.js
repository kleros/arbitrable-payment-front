import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Blockies from 'react-blockies'
import { ClipLoader } from 'react-spinners'
import ReactRouterPropTypes from 'react-router-prop-types'

import * as walletActions from '../../actions/wallet'
import * as contractSelectors from '../../reducers/contract'
import * as contractActions from '../../actions/contract'
import { renderIf } from '../../utils/react-redux'
import { redirect, shortAddress } from '../../utils/contract'
import { DISPUTE_CREATED, DISPUTE_RESOLVED } from '../../constants/contract'

import './contract.css'

class Contract extends PureComponent {
  state = {
    party: '',
    partyOther: ''
  }
  static propTypes = {
    contract: contractSelectors.contractShape.isRequired,
    accounts: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    fetchContract: PropTypes.func.isRequired,
    fetchGetdispute: PropTypes.func.isRequired,
    createDispute: PropTypes.func.isRequired,
    createTimeout: PropTypes.func.isRequired,
    createPay: PropTypes.func.isRequired,
    createReimburse: PropTypes.func.isRequired,

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
    const { contract: prevContract, fetchGetdispute, match } = this.props
    const { contract, accounts = [] } = nextProps
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
      if (contract.data && contract.data.disputeId) {
        fetchGetdispute(match.params.contractAddress, contract.data.disputeId)
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

  showEmptyContractEl = contract => contract.data.amount.e === 0

  hideEmptyContractEl = contract => ({
    display: contract.data.amount.e === 0 ? 'none' : 'block'
  })

  isTimeout = contract => {
    const timeout =
      contract.data.lastInteraction.toNumber() + contract.data.timeout
    const dateTime = (Date.now() / 1000) | 0
    return dateTime < timeout
  }

  toUrl = url => () => window.location.replace(url)

  render() {
    const { contract, accounts, history } = this.props
    const { partyOther, party } = this.state
    return (
      <div>
        {renderIf(
          [contract.loading],
          [
            contract.data &&
              contract.data.partyAFee &&
              accounts.data &&
              accounts.data[0]
          ],
          [contract.failedLoading || accounts.failedLoading],
          {
            loading: (
              <div className="loader">
                <ClipLoader color={'gray'} loading={1} />
              </div>
            ),
            done: contract.data && (
              <div className="Contract">
                <div className="Contract-content">
                  <div className="Contract-content-address">
                    <div>
                      <Blockies
                        seed={contract.data.address}
                        size={6}
                        scale={10}
                        bgColor="#f5f5f5"
                      />
                    </div>
                    <div className="Contract-content-address-address short">
                      {contract.data.title}
                    </div>
                  </div>
                  <div className="Contract-content-partyB">
                    <div className="Contract-content-partyB-identicon">
                      <Blockies
                        seed={contract.data.partyA}
                        size={5}
                        scale={4}
                        bgColor="#f5f5f5"
                      />
                    </div>
                    <div className="Contract-content-partyB-content">
                      {shortAddress(contract.data.partyA)}
                    </div>

                    <div>&nbsp;&nbsp;</div>

                    <div className="Contract-content-partyB-identicon">
                      <Blockies
                        seed={contract.data.partyB}
                        size={5}
                        scale={4}
                        bgColor="#f5f5f5"
                      />
                    </div>

                    <div className="Contract-content-partyB-content">
                      {shortAddress(contract.data.partyB)}
                    </div>
                  </div>

                  <div className="Contract-content-item Contract-content-item-mail">
                    {contract.data.email}
                  </div>
                  <div className="description Contract-content-item">
                    {contract.data.description}
                  </div>
                  {contract.data.status !== DISPUTE_RESOLVED &&
                  !contract.data.partyAFee &&
                  !contract.data.partyBFee ? (
                    <div className="Contract-content-actions">
                      <div
                        style={this.hideEmptyContractEl(contract)}
                        className="Contract-content-actions-button Contract-actions-button-left"
                        onClick={this.createDispute}
                      >
                        Create dispute
                      </div>
                      {contract.data.partyA === accounts.data[0] && (
                        <div
                          style={this.hideEmptyContractEl(contract)}
                          className="Contract-content-actions-button Contract-content-actions-button-right"
                          onClick={this.createPay}
                        >
                          Pay
                        </div>
                      )}
                      {contract.data.partyB === accounts.data[0] && (
                        <div
                          style={this.hideEmptyContractEl(contract)}
                          className="Contract-content-actions-button Contract-content-actions-button-right"
                          onClick={this.createReimburse}
                        >
                          Reimburse
                        </div>
                      )}
                    </div>
                  ) : (
                    <div />
                  )}
                  {contract.data.status !== DISPUTE_RESOLVED &&
                  !contract.data[`${party}Fee`] &&
                  contract.data[`${partyOther}Fee`] ? (
                    <div>
                      <div className="Contract-content-waiting">
                        The other party raises a dispute.<br />
                        So as not to lose the dispute you must pay the fee.
                      </div>
                      <div className="Contract-content-actions">
                        <div
                          className="Contract-content-actions-button"
                          onClick={this.createDispute}
                        >
                          Pay the fee
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}
                  {contract.data &&
                  contract.data.status !== DISPUTE_RESOLVED &&
                  !this.isTimeout(contract) &&
                  contract.data[`${party}Fee`] &&
                  !contract.data[`${partyOther}Fee`] ? (
                    <div className="Contract-content-waiting">
                      Waiting pay fee from the other party<br />
                      ({shortAddress(contract.data[`${partyOther}`])})
                    </div>
                  ) : (
                    <div />
                  )}
                  {contract.data &&
                  contract.data.status !== DISPUTE_RESOLVED &&
                  this.isTimeout(contract) &&
                  contract.data[`${party}Fee`] &&
                  !contract.data[`${partyOther}Fee`] ? (
                    <div className="Contract-content-actions">
                      <div
                        className="Contract-content-actions-button"
                        onClick={this.timeout}
                      >
                        {`Timeout ${partyOther}`}
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}
                  {contract.data.status !== DISPUTE_RESOLVED &&
                  contract.data.partyAFee &&
                  contract.data.partyBFee ? (
                    <div className="Contract-content-actions">
                      <div
                        className="Contract-content-actions-button"
                        onClick={redirect('/evidences/new', history)}
                      >
                        Send Evidence
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}
                  {contract.data.status === DISPUTE_CREATED && (
                    <div>
                      <b>Waiting the dispute resolution</b>
                    </div>
                  )}
                  {this.showEmptyContractEl(contract) && (
                    <div className="Contract-content-item">
                      <b>The contract is closed.</b>
                    </div>
                  )}
                  {contract.data.disputeId !== 0 && (
                    <div>
                      <b>Dispute id: {contract.data.disputeId}</b>
                    </div>
                  )}
                  {contract.data.evidences.map((evidence, i) => (
                    <div
                      className="Contract-content-evidenceCard"
                      onClick={this.toUrl(evidence.url)}
                      key={i}
                    >
                      <div className="Contract-content-evidenceCard-name short">
                        {evidence.name}
                      </div>
                      <div className="description">{evidence.description}</div>
                      <div className="Contract-content-evidenceCard-url short">
                        {evidence.url}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
            failed: contract.failedLoading && 'failedLoading contract'
          }
        )}
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
    fetchGetdispute: contractActions.fetchGetdispute,
    createDispute: contractActions.createDispute,
    createPay: contractActions.createPay,
    createReimburse: contractActions.createReimburse,
    fetchAccounts: walletActions.fetchAccounts,
    createTimeout: contractActions.createTimeout
  }
)(Contract)
