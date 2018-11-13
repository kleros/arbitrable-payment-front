import _ from 'lodash'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Blockies from 'react-blockies'
import { ClipLoader } from 'react-spinners'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'

import * as walletActions from '../../actions/wallet'
import * as contractActions from '../../actions/contract'
import * as contractSelectors from '../../reducers/contract'
import { renderIf } from '../../utils/react-redux'
import { redirect, shortAddress } from '../../utils/contract'
import { DISPUTE_CREATED, DISPUTE_RESOLVED } from '../../constants/contract'
import * as arbitratorConstants from '../../constants/arbitrator'
import TextInput from '../../components/text-input'

import './contract.css'

class Contract extends PureComponent {
  state = {
    open: false,
    party: {
      name: 'buyer',
      method: 'Pay'
    },
    partyOther: {
      name: 'buyer',
      method: 'Pay'
    },
    arbitrableTransaction: {},
    amount: 0
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
    this.setState({
      arbitrableTransaction: JSON.parse(
        localStorage.getItem('arbitrableTransaction')
      )
    })
  }

  componentWillReceiveProps(nextProps) {
    const { contract: prevContract } = this.props
    const { contract, accounts = [] } = nextProps
    if (prevContract !== contract) {
      if (
        contract.data &&
        contract.data.buyer === accounts.data[0].toLowerCase()
      ) {
        this.setState({
          party: {
            name: 'buyer',
            method: 'Pay'
          }
        })
        this.setState({
          partyOther: {
            name: 'seller',
            method: 'Reimburse'
          }
        })
      } else if (
        contract.data &&
        contract.data.seller === accounts.data[0].toLowerCase()
      ) {
        this.setState({
          partyOther: {
            name: 'buyer',
            method: 'Pay'
          }
        })
        this.setState({
          party: {
            name: 'seller',
            method: 'Reimburse'
          }
        })
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
    const { accounts, contract, createPay, createReimburse, match } = this.props
    const { amount } = this.state
    if (contract.data.buyer === accounts.data[0].toLowerCase())
      createPay(match.params.contractAddress, amount)
    else createReimburse(match.params.contractAddress, amount)
  }

  timeout = () => {
    const { contract, createTimeout, match } = this.props
    createTimeout(
      match.params.contractAddress,
      contract.data.buyer,
      contract.data.seller
    )
  }

  showEmptyContractEl = contract =>
    contract.data.amount && contract.data.amount.e === 0

  hideEmptyContractEl = contract => ({
    display: contract.data.amount === 0 ? 'none' : 'block'
  })

  isTimeout = contract => {
    const timeout = contract.data.lastInteraction + contract.data.timeout
    const dateTime = (Date.now() / 1000) | 0
    return dateTime > timeout
  }

  toUrl = url => () => window.location.replace(url)

  onOpenModal = () => this.setState({ open: true })

  onCloseModal = () => this.setState({ open: false })

  onChangeAmount = e => this.setState({ amount: e.target.value })

  render() {
    const {
      contract,
      accounts,
      arbitrator,
      appeal,
      evidence,
      history
    } = this.props
    const { partyOther, party } = this.state
    const ruling = ['no ruling', 'buyer', 'seller']
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
                      {(!!contract.data.metaEvidence &&
                        contract.data.metaEvidence.title) ||
                        // eslint-disable-next-line react/destructuring-assignment
                        this.state.arbitrableTransaction.metaEvidence.title}
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
                      {shortAddress(
                        contract.data.buyer ||
                          // eslint-disable-next-line react/destructuring-assignment
                          this.state.arbitrableTransaction.buyer.toLowerCase()
                      )}
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
                      {shortAddress(
                        contract.data.seller ||
                          // eslint-disable-next-line react/destructuring-assignment
                          this.state.arbitrableTransaction.seller.toLowerCase()
                      )}
                    </div>

                    <div>&nbsp;&nbsp;</div>

                    <div className="Contract-content-amount">
                      <FA name="th-large" />&nbsp;
                      {contract.data.amount || this.state.arbitrableTransaction.amount}{' '}
                      ETH
                    </div>
                    {contract.data.metaEvidence && contract.data.metaEvidence.fileURI ? (
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

                  <div className="Contract-content-description">
                    {(contract.data.metaEvidence &&
                      contract.data.metaEvidence.description) ||
                      // eslint-disable-next-line react/destructuring-assignment
                      this.state.arbitrableTransaction.metaEvidence.description}
                  </div>

                  {contract.data.status !== DISPUTE_RESOLVED &&
                    contract.data.amount === 0 && (
                      <div>
                        <div className="Contract-content-actions-completed">
                          Transaction completed
                        </div>
                      </div>
                    )}
                  {contract.data.status !== DISPUTE_RESOLVED &&
                  contract.data.amount !== 0 &&
                  !this.isTimeout(contract) &&
                  !contract.data[`${party.name}Fee`] &&
                  contract.data[`${partyOther.name}Fee`] ? (
                    <div>
                      <div className="Contract-content-actions-waiting">
                        The other party has raised a dispute.<br />
                        In order to not forfeit the dispute pay the arbitration
                        fee. You will be refunded the fee if you win the
                        dispute.
                      </div>
                      <div className="Contract-content-actions">
                        <div
                          className="Contract-content-actions-button Contract-content-actions-button-left"
                          onClick={this.createDispute}
                        >
                          Pay the fee&nbsp;&nbsp;&nbsp;<FA name="bolt" />
                        </div>
                        <div
                          className={`Contract-content-actions-button Contract-content-actions-button-right`}
                          onClick={this.createPay}
                        >
                          {party.method}&nbsp;&nbsp;&nbsp;<FA name="arrow-right" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}
                  {contract.data &&
                  contract.data.amount !== 0 &&
                  contract.data.status !== DISPUTE_RESOLVED &&
                  !this.isTimeout(contract) &&
                  contract.data[`${party.name}Fee`] &&
                  !contract.data[`${partyOther.name}Fee`] ? (
                    <div className="Contract-content-actions-waiting">
                      Waiting for other party to pay the fee.<br />
                      ({shortAddress(contract.data[`${partyOther.name}`])})
                    </div>
                  ) : (
                    <div />
                  )}
                  {contract.data &&
                  contract.data.amount !== 0 &&
                  contract.data.status !== DISPUTE_RESOLVED &&
                  this.isTimeout(contract) &&
                  contract.data[`${party.name}Fee`] &&
                  !contract.data[`${partyOther.name}Fee`] ? (
                    <div className="Contract-content-actions">
                      <div
                        className={`Contract-content-actions-button Contract-content-actions-button-right`}
                        onClick={this.createPay}
                      >
                        {party.method}&nbsp;&nbsp;&nbsp;<FA name="arrow-right" />
                      </div>
                      <div
                        className="Contract-content-actions-button Contract-content-actions-button-right"
                        onClick={this.timeout}
                      >
                        {`Timeout ${partyOther.name}`}&nbsp;&nbsp;&nbsp;<FA name="arrow-right" />
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}
                  {contract.data.status === DISPUTE_CREATED &&
                  contract.data.canAppeal === false ? (
                    <div className="Contract-content-actions-waiting">
                      <b>Waiting the dispute resolution</b>
                    </div>
                  ) : (
                    <div />
                  )}
                  {contract.data.status === DISPUTE_CREATED &&
                  contract.data.canAppeal === true ? (
                    <div className="Contract-content-actions-waiting">
                      {_.isNull(contract.data.ruling) && 'Dispute Active'}
                      {contract.data.ruling === '0' && 'No Ruling.'}
                      {contract.data.ruling === '1' &&
                        'Buyer wins the current dispute.'}
                      {contract.data.ruling === '2' &&
                        'Seller wins the current dispute.'}
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
                        className={`Contract-content-actions-button Contract-content-actions-button-right ${
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
                    contract.data.amount !== 0 &&
                    !contract.data.buyerFee &&
                    !contract.data.sellerFee && (
                      <div className="Contract-content-actions">
                        <div
                          className={`Contract-content-actions-button Contract-content-actions-button-left`}
                          onClick={this.createDispute}
                        >
                          Create dispute&nbsp;&nbsp;&nbsp;<FA name="bolt" />
                        </div>
                        <div className={`Contract-content-actions-partialPay`}>
                          <TextInput input={{onChange: this.onChangeAmount}} meta={{}} placeholder={contract.data.amount || this.state.arbitrableTransaction.amount} />
                          <div className='Contract-content-actions-partialPay-currency'>ETH</div>
                          <div
                            className={`Contract-content-actions-button Contract-content-actions-button-right`}
                            onClick={this.createPay}
                          >
                            {party.method}&nbsp;&nbsp;&nbsp;<FA name="arrow-right" />
                          </div>
                        </div>
                      </div>
                    )}
                  {contract.data.status !== DISPUTE_RESOLVED &&
                  contract.data.buyerFee &&
                  contract.data.sellerFee ? (
                    <div className="Contract-content-actions">
                      <div />
                      <div
                        className={`Contract-content-actions-button Contract-content-actions-button-right ${
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
                        {contract.data.ruling === '0' && 'No ruling.'}
                        {contract.data.ruling === '1' &&
                          'Buyer wins the current dispute.'}
                        {contract.data.ruling === '2' &&
                          'Seller wins the current dispute.'}
                      </b>
                    </div>
                  ) : (
                    <div />
                  )}
                  {contract.data.evidence &&
                    contract.data.evidence.map((evidence, i) => (
                      <div
                        className="Contract-content-evidenceCard"
                        onClick={this.toUrl(evidence.url)}
                        key={i}
                      >
                        <div className="Contract-content-evidenceCard-name short">
                          {evidence.name}
                        </div>
                        <div className="description">
                          {evidence.description}
                        </div>
                        <div className="Contract-content-evidenceCard-url short">
                          {evidence.URI}
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
