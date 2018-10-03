import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Stepper from 'flex-react-stepper'

import * as walletSelectors from '../../../reducers/wallet'
import * as walletActions from '../../../actions/wallet'
import * as contractSelectors from '../../../reducers/contract'
import * as contractActions from '../../../actions/contract'
import {
  CreateEvidenceForm,
  getCreateEvidenceFormIsInvalid,
  submitCreateEvidenceForm
} from '../../../forms/evidence'

import './new-evidence.css'

const FINAL_STEP = 2

class NewEvidence extends PureComponent {
  static propTypes = {
    balance: walletSelectors.balanceShape.isRequired,
    contract: contractSelectors.contractShape.isRequired,
    createEvidenceFormIsInvalid: PropTypes.bool.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    submitCreateEvidenceForm: PropTypes.func.isRequired,
    createEvidence: PropTypes.func.isRequired
  }

  state = {
    hasPrevPage: null,
    hasNextPage: null,
    step: 0
  }

  componentDidMount() {
    const { fetchBalance } = this.props
    fetchBalance()
  }

  getBackHandlerRef = ref => (this.backHandler = ref)

  handlePageChange = ({ hasPrevPage, hasNextPage }) =>
    this.setState({ hasPrevPage, hasNextPage })

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const { submitCreateEvidenceForm } = this.props
      const { step } = this.state
      submitCreateEvidenceForm()
      this.setState({ step: step + 1 })
    }
  }

  nextStep = event => {
    event.preventDefault()
    const { submitCreateEvidenceForm } = this.props
    const { step } = this.state
    submitCreateEvidenceForm()
    this.setState({ step: step + 1 })
  }

  isUrl = url => {
    const re = /^(http:\/\/|https:\/\/)(www){0,1}[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:\d{1,5})?(\/.*)?$/g
    return re.test(String(url).toLowerCase())
  }

  isFieldOk = step => {
    const { form } = this.props
    switch (step) {
      case 0:
        return (
          form &&
          form.createEvidenceFormKey &&
          form.createEvidenceFormKey.values &&
          form.createEvidenceFormKey.values.name !== '' &&
          form.createEvidenceFormKey.values.name != null
        )
      case 1:
        return (
          form &&
          form.createEvidenceFormKey &&
          form.createEvidenceFormKey.values &&
          form.createEvidenceFormKey.values.description !== '' &&
          form.createEvidenceFormKey.values.description != null
        )
      case 2:
        return (
          form &&
          form.createEvidenceFormKey &&
          form.createEvidenceFormKey.values &&
          this.isUrl(form.createEvidenceFormKey.values.url)
        )
      default:
        return false
    }
  }

  render() {
    const { submitCreateEvidenceForm, createEvidence, contract } = this.props

    const { step } = this.state

    return (
      <div className="container">
        <div>
          <Stepper steps={['Name', 'Description', 'Url']} activeStep={step} />
        </div>
        <div className="NewContract">
          <div className="NewContract-form" onKeyPress={this.handleKeyPress}>
            <div>
              <CreateEvidenceForm
                backHandlerRef={this.getBackHandlerRef}
                onPageChange={this.handlePageChange}
                onSubmit={createEvidence}
                initialValues={{
                  arbitrableTransactionId: contract.data.arbitrableTransactionId
                }}
              />
              {step === FINAL_STEP &&
                this.isFieldOk(step) && (
                  <div
                    className="NewContract-form-release"
                    onClick={submitCreateEvidenceForm}
                  >
                    Add the evidence
                  </div>
                )}
            </div>
            {this.isFieldOk(step) &&
              step !== FINAL_STEP && (
                <div onClick={this.nextStep} className="arrow-container">
                  <div className="arrow-container-arrow" />
                  <div className="arrow-container-arrow arrow-container-arrow-animation" />
                </div>
              )}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    balance: state.wallet.balance,
    contract: state.contract.contract,
    evidence: state.contract.evidence,
    createEvidenceFormIsInvalid: getCreateEvidenceFormIsInvalid(state),
    form: state.form
  }),
  {
    fetchBalance: walletActions.fetchBalance,
    submitCreateEvidenceForm,
    createEvidence: contractActions.createEvidence
  }
)(NewEvidence)
