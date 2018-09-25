import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as walletActions from '../../actions/wallet'
import * as contractActions from '../../actions/contract'
import * as walletSelectors from '../../reducers/wallet'
import * as contractSelectors from '../../reducers/contract'
import { ContractDisplayList } from '../contract-display-list'
import { renderIf } from '../../utils/react-redux'

import './home.css'

class Home extends PureComponent {
  state = {
    totalContracts: 0
  }

  static propTypes = {
    loadingContracts: PropTypes.bool,
    contract: contractSelectors.contractShape.isRequired,
    fetchContracts: PropTypes.func.isRequired,

    balance: walletSelectors.balanceShape.isRequired,
    fetchBalance: PropTypes.func.isRequired
  }

  static defaultProps = {
    loadingContracts: false
  }

  componentDidMount() {
    const { fetchBalance, fetchContracts } = this.props
    fetchBalance()
    fetchContracts()
  }

  render() {
    const { balance, contract, contracts, accounts, history } = this.props

    return (
      <div className="container">
        {renderIf([balance.loading], [balance.data], [balance.failedLoading], {
          loading: <span>loading</span>,
          done: contracts.data && (
            <div className="flex-container-main">
              <ContractDisplayList
                contracts={contracts}
                contract={contract}
                history={history}
                accounts={accounts}
              />
              <div className="flex-container-main-flex-grow" />
            </div>
          ),
          failed: contract.failedLoading && 'failedLoading'
        })}
      </div>
    )
  }
}

export default connect(
  state => ({
    balance: state.wallet.balance,
    contract: state.contract.contract,
    contracts: state.contract.contracts,
    accounts: state.wallet.accounts
  }),
  {
    fetchBalance: walletActions.fetchBalance,
    fetchContracts: contractActions.fetchContracts
  }
)(Home)
