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
import Button from '../../../components/button'

import './new-contract.css'

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
    if (event.key === 'Enter' && this.state.step !== 3) {
      event.preventDefault()
      const { submitCreateContractForm } = this.props
      submitCreateContractForm()
      this.setState({step: this.state.step+1})
    }
  }

  nextStep = event => {
    event.preventDefault()
    const { submitCreateContractForm } = this.props
    submitCreateContractForm()
    this.setState({step: this.state.step+1})
  }

  isAddress = address => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true
    } else {
        // Otherwise check each case
        return this.isChecksumAddress(address);
    }
  }

  isChecksumAddress = address => {
    // Check each case
    address = address.replace('0x','')
    let addressHash = sha3(address.toLowerCase())
    for (let i = 0; i < 40; i++) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false
        }
    }
    return true;
  }

  isEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase());
  }

  isFieldOk = () => {
    switch (this.state.step) {
      case 0:
        if (
          this.props.form
          && this.props.form.createContractFormKey
          && this.props.form.createContractFormKey.values
          && this.isAddress(this.props.form.createContractFormKey.values.partyB)
        )
          return true
      case 1:
        if (
          this.props.form
          && this.props.form.createContractFormKey
          && this.props.form.createContractFormKey.values
          && !isNaN(this.props.form.createContractFormKey.values.payment)
          && this.props.form.createContractFormKey.values.payment > 0
        )
          return true
      case 2:
        if (
          this.props.form
          && this.props.form.createContractFormKey
          && this.props.form.createContractFormKey.values
          && this.isEmail(this.props.form.createContractFormKey.values.email)
        )
          return true
        case 3:
          if (
            this.props.form
            && this.props.form.createContractFormKey
            && this.props.form.createContractFormKey.values
            && this.props.form.createContractFormKey.values.description != ''
            && this.props.form.createContractFormKey.values.description != null
          )
        return true
      }
    return false
  }

  render() {
    const {
      createContractFormIsInvalid,
      submitCreateContractForm,
      createContract
    } = this.props

    const {
      hasPrevPage,
      hasNextPage,
      step,
      allowNextStep
    } = this.state

    return (
      <div className="container">
        <div>
          <Stepper
            steps={
              [
                {title: 'Address PartyB'},
                {title: 'Payment'},
                {title: 'Email'},
                {title: 'Description'}
              ]
            }
            activeStep={ step }
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
              {
                step === 3 && this.isFieldOk() &&
                <div
                  className="NewContract-form-release"
                  onClick={submitCreateContractForm}>
                    Release the contract
                </div>
              }
            </div>
            {
              this.isFieldOk() && step != 3 &&
              <div onClick={this.nextStep} className="arrow-container">
                <div className="arrow-container-arrow"  />
                <div className="arrow-container-arrow arrow-container-arrow-animation" />
              </div>
            }
          </div>
        </div>
        <div className="flex-container-main-footer">
          Contracting front © 2018 powered by
          <span className="flex-container-main-footer-kleros">
            &nbsp;Kleros
          </span>
        </div>
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
