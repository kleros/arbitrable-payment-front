import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as walletActions from '../../actions/wallet'
import * as contractActions from '../../actions/contract'
import * as walletSelectors from '../../reducers/wallet'
import * as contractSelectors from '../../reducers/contract'
import { renderIf } from '../../utils/react-redux'
import {
  CreateContractForm,
  getCreateContractIsInvalid,
  submitCreateContract
} from '../../forms/contract'
import Identicon from '../../components/identicon'
import Button from '../../components/button'

import './contract.css'

class Contract extends PureComponent {
  static propTypes = {
    balance: walletSelectors.balanceShape.isRequired,
    contract: contractSelectors.contractShape.isRequired,
    fetchBalance: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { fetchBalance } = this.props
    fetchBalance()
  }

  render() {
    const {
      balance,
      loadingContracts,
      creatingContract,
      contract,
      createContractIsInvalid,
      fetchContracts,
      submitCreateContract,
      createContract
    } = this.props

    return (
      <div className="Balance">
        <div className="Balance-message">
          <CreateContractForm onSubmit={submitCreateContract} />
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    balance: state.wallet.balance,
    contract: state.contract.contract
  }),
  {
    fetchBalance: walletActions.fetchBalance,
    createContract: contractActions.createContract,
    submitCreateContract
  }
)(Contract)
