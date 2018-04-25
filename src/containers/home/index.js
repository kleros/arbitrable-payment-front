import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactRouterPropTypes from 'react-router-prop-types'

import * as walletActions from '../../actions/wallet'
import * as contractActions from '../../actions/contract'
import * as walletSelectors from '../../reducers/wallet'
import * as contractSelectors from '../../reducers/contract'
import { NavHeader } from '../nav-header'
import { ContractDisplayList } from '../contract-display-list'
import { renderIf } from '../../utils/react-redux'

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

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  static propTypes = {
    accounts: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    contract: contractSelectors.contractShape.isRequired,
    contracts: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    fetchContracts: PropTypes.func.isRequired,
    balance: walletSelectors.balanceShape.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchVersion: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired
  }

  componentDidMount() {
    this.intervalId = setInterval(this.randomSeed, 100)
    const { fetchBalance, fetchContracts, fetchVersion } = this.props
    fetchBalance()
    fetchContracts()
    fetchVersion()
  }

  getTotalContracts = totalContracts => {
    this.setState({ totalContracts })
    return totalContracts
  }

  render() {
    const { balance, contract, contracts, accounts, history } = this.props

    const { randomSeed } = this.state

    return (
      <div className="container">
        {renderIf([balance.loading], [balance.data], [balance.failedLoading], {
          loading: <span>loading</span>,
          done: contracts.data && (
            <div className="flex-container-main" key={contract._id}>
              <NavHeader history={history} />
              <ContractDisplayList
                randomSeed={randomSeed}
                contracts={contracts}
                contract={contract}
                history={history}
                accounts={accounts}
              />
              <div className="flex-container-main-flex-grow" />
              <div className="flex-container-main-footer">
                <a
                  href="http://www.wtfpl.net/"
                  className="flex-container-main-footer-wtfpl"
                >
                  <img
                    src="http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-2.png"
                    width="80"
                    height="15"
                    alt="WTFPL"
                  />
                </a>
                &nbsp;&middot; 2018-2019 &middot; Arbitrable payment powered by
                <span className="flex-container-main-footer-kleros">
                  &nbsp;Kleros
                </span>
              </div>
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
