import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as walletActions from '../../actions/wallet'
import * as contractActions from '../../actions/contract'
import * as walletSelectors from '../../reducers/wallet'
import * as contractSelectors from '../../reducers/contract'
import { NavHeader } from '../nav-header'
import { ContractDisplayList } from '../contract-display-list'
import { renderIf } from '../../utils/react-redux'
import { HomeKlerosFooter } from '../home-kleros-footer'

import './home.css'

class Home extends PureComponent {
  state = {
    randomSeed: '',
    totalContracts: 0
  }

  randomSeed = () =>
    this.setState({
      randomSeed: Math.random()
        .toString(36)
        .substring(6)
        .toString()
    })

  componentWillUnmount () {
    clearInterval(this.intervalId)
  }

  static propTypes = {
    loadingContracts: PropTypes.bool,
    contract: contractSelectors.contractShape.isRequired,
    fetchContracts: PropTypes.func.isRequired,

    balance: walletSelectors.balanceShape.isRequired,
    version: walletSelectors.versionShape.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchVersion: PropTypes.func.isRequired
  }

  static defaultProps = {
    loadingContracts: false
  }

  componentDidMount () {
    this.intervalId = setInterval(this.randomSeed, 100)
    const {fetchBalance, fetchContracts, fetchVersion} = this.props
    fetchBalance()
    fetchContracts()
    fetchVersion()
  }

  getTotalContracts = totalContracts => {
    this.setState({totalContracts})
    return totalContracts
  }

  render () {
    const {balance, contract, contracts, accounts, history} = this.props

    const {randomSeed} = this.state

    return (
      <div className="container">
        {renderIf([balance.loading], [balance.data], [balance.failedLoading], {
          loading: <span>loading</span>,
          done: contracts.data && (
            <div className="flex-container-main" key={contract._id}>
              <NavHeader history={history}/>
              <ContractDisplayList
                randomSeed={randomSeed}
                contracts={contracts}
                contract={contract}
                history={history}
                accounts={accounts}
              />
              <div className="flex-container-main-flex-grow"/>
              <HomeKlerosFooter/>
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
    accounts: state.wallet.accounts,
    version: state.wallet.version
  }),
  {
    fetchBalance: walletActions.fetchBalance,
    fetchAccounts: walletActions.fetchAccounts,
    fetchContracts: contractActions.fetchContracts,
    fetchVersion: walletActions.fetchVersion
  }
)(Home)
