import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import sha3 from 'crypto-js/sha3'
import Stepper from 'react-stepper-horizontal'

import * as walletSelectors from '../../../reducers/wallet'
import * as walletActions from '../../../actions/wallet'
import * as contractSelectors from '../../../reducers/contract'
import * as contractActions from '../../../actions/contract'
import {
  CreateContractForm,
  getCreateContractFormIsInvalid,
  submitCreateContractForm
} from '../../../forms/contract'

import { SharedKlerosFooter } from '../../shared-kleros-footer'
import './new-contract.css'

const FINAL_STEP = 4

class NewContract extends PureComponent {
  static propTypes = {
    balance: walletSelectors.balanceShape.isRequired,
    contract: contractSelectors.contractShape.isRequired,
    createContractFormIsInvalid: PropTypes.bool.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    submitCreateContractForm: PropTypes.func.isRequired,
    createContract: PropTypes.func.isRequired
  }

  state = {
    hasPrevPage: null,
    hasNextPage: null,
    step: 0,
    allowNextStep: false
  }

  componentDidMount() {
    const { fetchBalance } = this.props
    fetchBalance()
  }

  getBackHandlerRef = ref => (this.backHandler = ref)

  handlePageChange = ({ hasPrevPage, hasNextPage }) =>
    this.setState({ hasPrevPage, hasNextPage })

  handleKeyPress = event => {
    const { step } = this.state
    if (event.key === 'Enter' && step !== FINAL_STEP) {
      event.preventDefault()
      const { submitCreateContractForm } = this.props
      submitCreateContractForm()
      this.setState({ step: step + 1 })
    }
  }

  nextStep = event => {
    event.preventDefault()
    const { submitCreateContractForm } = this.props
    const { step } = this.state
    submitCreateContractForm()
    this.setState({ step: step + 1 })
  }

  isAddress = address => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      // check if it has the basic requirements of an address
      return false
    } else if (
      /^(0x)?[0-9a-f]{40}$/.test(address) ||
      /^(0x)?[0-9A-F]{40}$/.test(address)
    ) {
      // If it's all small caps or all all caps, return true
      return true
    } else {
      // Otherwise check each case
      return this.isChecksumAddress(address)
    }
  }

  isChecksumAddress = address => {
    // Check each case
    address = address.replace('0x', '')
    let addressHash = sha3(address.toLowerCase())
    for (let i = 0; i < 40; i++) {
      // the nth letter should be uppercase if the nth digit of casemap is 1
      if (
        (parseInt(addressHash[i], 16) > 7 &&
          address[i].toUpperCase() !== address[i]) ||
        (parseInt(addressHash[i], 16) <= 7 &&
          address[i].toLowerCase() !== address[i])
      ) {
        return false
      }
    }
    return true
  }

  isEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  isFieldOk = stp => {
    const { form, submitCreateContractForm } = this.props
    const { step } = this.state
    switch (stp) {
      case 0:
        return (
          form &&
          form.createContractFormKey &&
          form.createContractFormKey.values &&
          form.createContractFormKey.values.title !== '' &&
          form.createContractFormKey.values.title != null
        )
      case 1:
        return (
          form &&
          form.createContractFormKey &&
          form.createContractFormKey.values &&
          this.isAddress(form.createContractFormKey.values.partyB) &&
          submitCreateContractForm() &&
          this.setState({ step: step + 1 })
        )
      case 2:
        return (
          form &&
          form.createContractFormKey &&
          form.createContractFormKey.values &&
          !isNaN(form.createContractFormKey.values.payment) &&
          form.createContractFormKey.values.payment > 0
        )
      case 3:
        return (
          form &&
          form.createContractFormKey &&
          form.createContractFormKey.values &&
          this.isEmail(form.createContractFormKey.values.email)
        )
      case 4:
        return (
          form &&
          form.createContractFormKey &&
          form.createContractFormKey.values &&
          form.createContractFormKey.values.description !== '' &&
          form.createContractFormKey.values.description != null
        )
      default:
        return false
    }
  }

  render() {
    const { submitCreateContractForm, createContract } = this.props

    const { step } = this.state

    return (
      <div className="container">
        <div>
          <Stepper
            steps={[
              { title: 'Title' },
              { title: 'Address PartyB' },
              { title: 'Payment' },
              { title: 'Email' },
              { title: 'Description' }
            ]}
            activeStep={step}
          />
        </div>
        <div className="NewContract">
          <div className="NewContract-form" onKeyPress={this.handleKeyPress}>
            <div>
              <CreateContractForm
                backHandlerRef={this.getBackHandlerRef}
                onPageChange={this.handlePageChange}
                onSubmit={createContract}
              />
              {step === FINAL_STEP &&
                this.isFieldOk(step) && (
                  <div
                    className="NewContract-form-release"
                    onClick={submitCreateContractForm}
                  >
                    Release the contract
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
        <SharedKlerosFooter />
      </div>
    )
  }
}

export default connect(
  state => ({
    balance: state.wallet.balance,
    contract: state.contract.contract,
    createContractFormIsInvalid: getCreateContractFormIsInvalid(state),
    form: state.form
  }),
  {
    fetchBalance: walletActions.fetchBalance,
    submitCreateContractForm,
    createContract: contractActions.createContract
  }
)(NewContract)
