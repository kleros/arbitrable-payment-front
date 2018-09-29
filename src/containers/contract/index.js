import _ from 'lodash'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Blockies from 'react-blockies'
import { ClipLoader } from 'react-spinners'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'
import Modal from 'react-responsive-modal'
import web3 from 'web3'
import FA from 'react-fontawesome'

import * as walletActions from '../../actions/wallet'
import * as contractActions from '../../actions/contract'
import * as contractSelectors from '../../reducers/contract'
import { renderIf } from '../../utils/react-redux'
import { redirect, shortAddress } from '../../utils/contract'
import { DISPUTE_CREATED, DISPUTE_RESOLVED } from '../../constants/contract'
import * as arbitratorConstants from '../../constants/arbitrator'

import './contract.css'

class Contract extends PureComponent {
  state = {
    party: '',
    partyOther: '',
    open: false
  }
  static propTypes = {
    contract: contractSelectors.contractShape.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    fetchContract: PropTypes.func.isRequired,
    createDispute: PropTypes.func.isRequired,
    createAppeal: PropTypes.func.isRequired,
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
    const { match, fetchContract, fetchArbitrator } = this.props
    fetchContract(match.params.contractAddress)
    fetchArbitrator()
  }

  componentWillReceiveProps(nextProps) {
    const { contract: prevContract } = this.props
    const { contract, accounts = [] } = nextProps
    if (prevContract !== contract) {
      if (contract.data && contract.data.buyer === accounts.data[0]) {
        this.setState({ party: 'buyer' })
        this.setState({ partyOther: 'seller' })
      } else if (contract.data && contract.data.seller === accounts.data[0]) {
        this.setState({ party: 'seller' })
        this.setState({ partyOther: 'buyer' })
      }
    }
  }

  createDispute = () => {
    const { createDispute, match } = this.props
    createDispute(match.params.contractAddress)
  }

  createAppeal = () => {
    const { contract, createAppeal, match } = this.props
    createAppeal(match.params.contractAddress, contract.data.disputeId)
  }

  createPay = () => {
    const { contract, createPay, match } = this.props
    createPay(
      match.params.contractAddress, // use arbitrableTransactionId
      contract.data.buyer
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

  showEmptyContractEl = contract =>
    contract.data.amount && contract.data.amount.e === 0

  hideEmptyContractEl = contract => ({
    display:
      contract.data.amount && contract.data.amount.e === 0 ? 'none' : 'block'
  })

  isTimeout = contract => {
    const timeout = contract.data.lastInteraction + contract.data.timeout
    const dateTime = (Date.now() / 1000) | 0
    return dateTime > timeout
  }

  toUrl = url => () => window.location.replace(url)

  onOpenModal = () => this.setState({ open: true })

  onCloseModal = () => this.setState({ open: false })

  render() {
    const {
      contract,
      accounts,
      arbitrator,
      dispute,
      reimburse,
      pay,
      appeal,
      evidence,
      history
    } = this.props
    const { partyOther, party, open } = this.state
    const ruling = ['no ruling', 'partyA', 'partyB']
    return (
      <div>
        {renderIf(
          [contract.loading],
          [contract.data && accounts.data && accounts.data[0]],
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
                    <div className="Contract-content-title">
                      {contract.data.metaEvidence.title}
                    </div>
                  </div>
                  <div className="Contract-content-parties">
                    <div className="Contract-content-parties-identicon">
                      <Blockies
                        seed={contract.data.buyer}
                        size={5}
                        scale={4}
                        bgColor="#f5f5f5"
                      />
                    </div>

                    <div className="Contract-content-parties-content">
                      {shortAddress(contract.data.buyer)}
                    </div>

                    <div>&nbsp;&nbsp;</div>

                    <div className="Contract-content-parties-identicon">
                      <Blockies
                        seed={contract.data.seller}
                        size={5}
                        scale={4}
                        bgColor="#f5f5f5"
                      />
                    </div>

                    <div className="Contract-content-parties-content">
                      {shortAddress(contract.data.seller)}
                    </div>

                    <div>&nbsp;&nbsp;</div>

                    <div className="Contract-content-amount">
                      <FA name="th-large" />&nbsp;
                      {web3.utils.fromWei(
                        contract.data.amount.toString(),
                        'ether'
                      )}{' '}
                      ETH
                    </div>
                    {contract.data.metaEvidence.fileURI ? (
                      <div className="Contract-content-fileUri">
                        &nbsp;&nbsp;&nbsp;<a
                          href={`${contract.data.metaEvidence.fileURI}`}
                          className="Contract-content-fileUri-a"
                        >
                          <FA name="external-link" />
                        </a>
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                  {contract.data.metaEvidence.description ? (
                    <div className="Contract-content-description">
                      {contract.data.metaEvidence.description}
                    </div>
                  ) : (
                    <div />
                  )}
                  {contract.data.status !== DISPUTE_RESOLVED &&
                  contract.data.amount != 0 &&
                  !contract.data.buyerFee &&
                  !contract.data.sellerBFee ? (
                    <div className="Contract-content-actions">
                      <div
                        style={this.hideEmptyContractEl(contract)}
                        className={`Contract-content-actions-button Contract-content-actions-button-left ${
                          dispute.creating
                            ? 'Contract-content-actions-button-is-loading'
                            : ''
                        }`}
                        onClick={this.createDispute}
                      >
                        Create dispute&nbsp;&nbsp;&nbsp;<FA name="bolt" />
                      </div>
                      {contract.data.buyer ===
                        accounts.data[0].toLowerCase() &&
                        contract.data.amount != 0 && (
                        <div
                          style={this.hideEmptyContractEl(contract)}
                          className={`Contract-content-actions-button Contract-content-actions-button-right ${
                            pay.creating
                              ? 'Contract-content-actions-button-is-loading'
                              : ''
                          }`}
                          onClick={this.createPay}
                        >
                          Pay&nbsp;&nbsp;&nbsp;<FA name="arrow-right" />
                        </div>
                      )}
                      {contract.data.seller ===
                        accounts.data[0].toLowerCase() && 
                        contract.data.amount != 0 && (
                        <div
                          style={this.hideEmptyContractEl(contract)}
                          className={`Contract-content-actions-button Contract-content-actions-button-right ${
                            reimburse.creating
                              ? 'Contract-content-actions-button-is-loading'
                              : ''
                          }`}
                          onClick={this.createReimburse}
                        >
                          Reimburse&nbsp;&nbsp;&nbsp;<FA name="arrow-right" />
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
                      <div className="Contract-content-actions-waiting">
                        The other party has raised a dispute.<br />
                        In order to not forfeit the dispute pay the arbitration
                        fee. You will be refunded the fee if you win the
                        dispute.
                      </div>
                      <div className="Contract-content-actions">
                        <div
                          className={`Contract-content-actions-button ${
                            dispute.creating
                              ? 'Contract-content-actions-button-is-loading'
                              : ''
                          }`}
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
                    <div className="Contract-content-actions-waiting">
                      Waiting for other party to pay the fee.<br />
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
                  {contract.data.status === DISPUTE_CREATED && contract.data.canAppeal === false ? (
                    <div className="Contract-content-actions-waiting">
                      <b>Waiting the dispute resolution</b>
                    </div>
                  ) : (
                    <div />
                  )}
                  {contract.data.status === DISPUTE_CREATED && contract.data.canAppeal === true ? (
                    <div className="Contract-content-actions-waiting">
                      {_.isNull(contract.data.ruling) && 'Dispute Active'}
                      {contract.data.ruling === 0 && 'No Ruling'}
                      {contract.data.ruling === 1 && 'Party A wins'}
                      {contract.data.ruling === 2 && 'Party B wins'}
                    </div>
                  ) : (
                    <div />
                  )}
                  {arbitrator.data &&
                  party !== ruling[contract.data.rulingChoices] &&
                  arbitratorConstants.PERIOD_ENUM[arbitrator.data.period] ===
                    'appeal' &&
                  contract.data.canAppeal ? (
                    <div className="Contract-content-actions">
                      <button
                        className={`Contract-content-actions-button ${
                          appeal.creating
                            ? 'Contract-content-actions-button-is-loading'
                            : ''
                        }`}
                        onClick={this.createAppeal}
                      >
                        Raise appeal
                      </button>
                    </div>
                  ) : (
                    <div />
                  )}
                  {contract.data.status !== DISPUTE_RESOLVED &&
                  contract.data.buyerFee &&
                  contract.data.sellerFee ? (
                    <div className="Contract-content-actions">
                      <div
                        className={`Contract-content-actions-button ${
                          evidence.creating
                            ? 'Contract-content-actions-button-is-loading'
                            : ''
                        }`}
                        onClick={redirect('/evidences/new', history)}
                      >
                        Send Evidence
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}
                  {this.showEmptyContractEl(contract) === true && (
                    <div className="Contract-content-item">
                      <b>The contract is closed.</b>
                    </div>
                  )}
                  {contract.data.status === DISPUTE_RESOLVED ? (
                    <div className="Contract-content-actions-ruling">
                      <b>
                        {contract.data.ruling === 0 && 'No ruling'}
                        {contract.data.ruling === 1 && 'Party A wins'}
                        {contract.data.ruling === 2 && 'Party B wins'}
                      </b>
                    </div>
                  ) : (
                    <div />
                  )}
                  {/*contract.data.evidence.map((evidence, i) => (
                    <div
                      className="Contract-content-evidenceCard"
                      onClick={this.toUrl(evidence.URI)}
                      key={i}
                    >
                      <div className="Contract-content-partyB">
                        <div className="Contract-content-partyB-identicon">
                          <Blockies
                            seed={evidence.submittedBy}
                            size={5}
                            scale={4}
                            bgColor="#f5f5f5"
                          />
                        </div>
                        <div className="Contract-content-partyB-content">
                          {shortAddress(evidence.submittedBy)}
                        </div>
                      </div>
                      <div className="Contract-content-evidenceCard-name short">
                        {evidence.name}
                      </div>
                      <div className="description">{evidence.description}</div>
                      <div className="Contract-content-evidenceCard-url short">
                        {evidence.URI}
                      </div>
                    </div>
                  ))*/}
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
    arbitrator: state.contract.arbitrator,
    pay: state.contract.pay,
    reimburse: state.contract.reimburse,
    appeal: state.contract.appeal,
    evidence: state.contract.evidence,
    timeout: state.contract.timeout,
    accounts: state.wallet.accounts
  }),
  {
    fetchContract: contractActions.fetchContract,
    createDispute: contractActions.createDispute,
    createAppeal: contractActions.createAppeal,
    createPay: contractActions.createPay,
    createReimburse: contractActions.createReimburse,
    fetchAccounts: walletActions.fetchAccounts,
    fetchArbitrator: contractActions.fetchArbitrator,
    createTimeout: contractActions.createTimeout
  }
)(Contract)
