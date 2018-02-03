import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as walletSelectors from '../../reducers/wallet'
import * as walletActions from '../../actions/wallet'
import * as contractSelectors from '../../reducers/contract'
import * as contractActions from '../../actions/contract'
import {
  CreateContractForm,
  getCreateContractFormIsInvalid,
  submitCreateContractForm
} from '../../forms/contract'
import Button from '../../components/button'

import './contract.css'

class Contract extends PureComponent {
  static propTypes = {
    balance: walletSelectors.balanceShape.isRequired,
    contract: contractSelectors.contractShape.isRequired,
    createContractFormIsInvalid: PropTypes.bool.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    submitCreateContractForm: PropTypes.func.isRequired,
    createContract: PropTypes.func.isRequired
  }

  state = { hasPrevPage: null, hasNextPage: null }

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
    }
  }

  render() {
    const {
      createContractFormIsInvalid,
      submitCreateContractForm,
      createContract
    } = this.props
    const { hasPrevPage, hasNextPage } = this.state

    return (
      <div className="Contract">
        <div className="Contract-form" onKeyPress={this.handleKeyPress}>
          <CreateContractForm
            backHandlerRef={this.getBackHandlerRef}
            onPageChange={this.handlePageChange}
            onSubmit={createContract}
          />
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
)(Contract)
