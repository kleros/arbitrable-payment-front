import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
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
      const { submitCreateContractForm } = this.props
      submitCreateContractForm()
      this.setState({step: this.state.step+1})
    }
  }

  render() {
    const {
      createContractFormIsInvalid,
      submitCreateContractForm,
      createContract
    } = this.props
    const { hasPrevPage, hasNextPage, step } = this.state

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
            </div>
            <div onClick={submitCreateContractForm} className="arrow-container">
              <div className="arrow-container-arrow"  />
              <div className="arrow-container-arrow arrow-container-arrow-animation" />
            </div>

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
    createContractFormIsInvalid: getCreateContractFormIsInvalid(state)
  }),
  {
    fetchBalance: walletActions.fetchBalance,
    submitCreateContractForm,
    createContract: contractActions.createContract
  }
)(NewContract)
