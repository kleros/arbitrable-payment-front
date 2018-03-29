import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Blockies from 'react-blockies'

import * as walletActions from '../../actions/wallet'
import * as contractActions from '../../actions/contract'
import * as walletSelectors from '../../reducers/wallet'
import * as contractSelectors from '../../reducers/contract'
import { renderIf } from '../../utils/react-redux'
import { redirect, shortAddress } from '../../utils/contract'
import { NavHeader } from '../nav-header'

import './profile.css'

class Profile extends PureComponent {
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
    loadingContracts: PropTypes.bool,
    contract: contractSelectors.contractShape.isRequired,
    creatingContract: PropTypes.bool,
    fetchContracts: PropTypes.func.isRequired,
    balance: walletSelectors.balanceShape.isRequired,
    version: walletSelectors.versionShape.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchVersion: PropTypes.func.isRequired
  }

  static defaultProps = {
    loadingContracts: false
  }

  componentDidMount() {
    this.intervalId = setInterval(this.randomSeed, 100)
    const { fetchBalance, fetchContracts, fetchVersion } = this.props
    fetchBalance()
    fetchContracts()
    fetchVersion()
  }

  render() {
    const {
      balance,
      contract,
      contracts,
      accounts,
      history
    } = this.props

    return (
      <div className="container">
        {renderIf([balance.loading], [balance.data], [balance.failedLoading], {
          loading: <span>loading</span>,
          done: contracts.data && (
            <div className="flex-container-main" key={contract._id}>
              <NavHeader history={history} />
              <div className="flex-container">
                <div className="flex-item wide grow">
                  <div className="type">Profile</div>
                  <Blockies seed="Jeremy" size={10} scale={14} bgColor="#fff" />
                  <div className="content">
                    <div className="address">
                      {shortAddress(accounts.data[0])}
                    </div>
                    <div className="balanceETH">
                      {Number(balance.data).toFixed(3)} ETH
                    </div>
                    <div className="nbContracts">
                      {contract.data && contracts.data.length + 1}
                      {!contract.data && contracts.data.length} contracts
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-container-main-flex-grow" />
              <div className="flex-container-main-footer">
                Contracting front © 2018 powered by
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
)(Profile)
