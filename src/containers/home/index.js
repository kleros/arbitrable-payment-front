import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ClipLoader } from 'react-spinners'

import * as walletActions from '../../actions/wallet'
import * as contractActions from '../../actions/contract'
import * as walletSelectors from '../../reducers/wallet'
import * as contractSelectors from '../../reducers/contract'
import { ContractDisplayList } from '../contract-display-list'
import { renderIf } from '../../utils/react-redux'

import './home.css'

class Home extends PureComponent {
  state = {
    contracts: []
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
    const { balance, contract, accounts, contracts, history } = this.props

    return (
      <div className="container">
        {renderIf([balance.loading], [balance.data], [balance.failedLoading], {
          loading: (
            <div className="loader">
              <ClipLoader color={'gray'} loading={1} />
            </div>
          ),
          done: contracts.data ? (
            <div className="flex-container-main">
              <ContractDisplayList
                contracts={contracts.data}
                contract={contract}
                history={history}
                accounts={accounts}
              />
              <div className="flex-container-main-flex-grow" />
            </div>
          ) : (
            <div className="loader">
              <ClipLoader color={'gray'} loading={1} />
            </div>
          ),
          failed: contracts.failedLoading && 'failedLoading'
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
