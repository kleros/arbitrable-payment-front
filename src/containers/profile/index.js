import _ from 'lodash'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { push } from 'react-router-redux'
import Blockies from 'react-blockies'

import * as walletActions from '../../actions/wallet'
import * as contractActions from '../../actions/contract'
import * as walletSelectors from '../../reducers/wallet'
import * as contractSelectors from '../../reducers/contract'
import { objMap } from '../../utils/functional'
import { renderIf } from '../../utils/react-redux'
import Identicon from '../../components/identicon'

import {redirect} from '../../utils/contract'

import './profile.css'

class Profile extends PureComponent {
  state = {
    randomSeed: '',
    totalContracts: 0
  }

  randomSeed = () => this.setState({randomSeed: Math.random().toString(36).substring(6).toString()})

  componentWillUnmount () {
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

  componentDidMount () {
    this.intervalId = setInterval(this.randomSeed, 100)
    const {fetchBalance, fetchContracts, fetchVersion} = this.props
    fetchBalance()
    fetchContracts()
    fetchVersion()
  }

  shortAddress = address => {
    const startAddress = address.substr(0, address.length - 36)
    const endAddress = address.substr(37)
    return `${startAddress}...${endAddress}`
  }

  getTotalContracts = totalContracts => {
    this.setState({totalContracts})
    return totalContracts
  }

  render () {
    const {
      balance,
      contract,
      loadingContract,
      contracts,
      accounts,
      version
    } = this.props

    return (
      <div className="container">
        {renderIf([balance.loading], [balance.data], [balance.failedLoading],
          {
            loading: <span>loading</span>,
            done: contracts.data && (
              <div className="flex-container-main" key={contract._id}>
                <div className="flex-container-main-menu">
                  <div className="flex-container-main-menu-items">
                    <div
                      className="flex-container-main-menu-items-item flex-container-main-menu-items-kleros">
                      KLEROS
                    </div>
                    <div
                      className="flex-container-main-menu-items-item">
                      Profile
                    </div>
                    <div
                      className="flex-container-main-menu-items-item"
                      onClick={() => redirect('/contracts/new', this.props.history)}>
                      New contract
                    </div>
                  </div>
                </div>
                <div className="flex-container">
                  <div className="flex-item wide grow">
                    <div className="type">Profile</div>
                    <Blockies seed="Jeremy" size={10} scale={14} bgColor="#fff"/>
                    <div className="content">
                      <div className="address">{this.shortAddress(accounts.data[0])}</div>
                      <div className="balanceETH">{Number(balance.data).toFixed(3)} ETH</div>
                      <div className="nbContracts">
                        {contract.data && contracts.data.length + 1}
                        {!contract.data && contracts.data.length} contracts
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-container-main-flex-grow">

                </div>
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
