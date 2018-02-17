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

import './home.css'

class Home extends PureComponent {
  state = {
    randomSeed: '',
    totalContracts: 0
  }

  randomSeed = () => (this.setState({randomSeed: Math.random().toString(36).substring(6).toString()}))

  componentWillUnmount(){
    clearInterval(this.intervalId);
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
    this.intervalId = setInterval(this.randomSeed, 100);
    const { fetchBalance, fetchContracts, fetchVersion } = this.props
    fetchBalance()
    fetchContracts()
    fetchVersion()
  }

  shortAddress = address => {
    const startAddress = address.substr(0, address.length-36)
    const endAddress = address.substr(37)

    return `${startAddress}...${endAddress}`
  }

  getTotalContracts = totalContracts => {
    this.setState({totalContracts})

    return totalContracts
  }

  // TODO go to utils
  redirect = (url, ...args) => {
    if (!args.length) {
      this.props.history.push(url);
    } else {
      const allArgs = args.reduce((acc, arg, url) => (`${acc}/${arg}`))

      this.props.history.push(`${url}/${allArgs}`)
    }

  }

  render() {
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
        {renderIf(
          [balance.loading],
          [balance.data],
          [balance.failedLoading],
          {
            loading: <span>loading</span>,
            done: contracts.data && (
              <div className="flex-container-main" key={contract._id}>
                <div className="flex-container-main-menu">
                  <div className="flex-container-main-menu-items">
                    <div
                      className="flex-container-main-menu-items-item kleros">
                      KLEROS
                    </div>
                    <div
                      className="flex-container-main-menu-items-item">
                      Profile
                    </div>
                    <div
                      className="flex-container-main-menu-items-item"
                      onClick={() => this.redirect('/contracts/new')}>
                      New contract
                    </div>
                  </div>
                </div>
              <div className="flex-container">
                <div className="flex-item wide contract grow">
                  <div className="type">Profile</div>
                  <Blockies seed="Jeremy" size={10} scale={14} bgColor="#fff" />
                  <div className="content">
                    <div className="address">{this.shortAddress(accounts.data[0])}</div>
                    <div className="balanceETH">{Number(balance.data).toFixed(3)} ETH</div>
                    <div className="nbContracts">
                      {contract.data && contracts.data.length+1}
                      {!contract.data && contracts.data.length} contracts
                    </div>
                  </div>
                </div>


                <div
                  className="flex-item wide grow newContract"
                  onClick={() => this.redirect('/contracts/new')}
                >
                  New Contract
                </div>

                {contract.creating &&
                  <div className="flex-item wide grow" onClick={() => this.redirect(`/contracts/${contract.address}`)}>
                    <Blockies seed={this.state.randomSeed} size={10} scale={14} bgColor="#fff" />
                    <div className="creationContentContract">
                      <div>
                        Contract creation
                      </div>
                    </div>
                  </div>
                }

                {contract.data && contract.data.address && !contracts.data.some(c => c.address === contract.data.address) &&
                  <div className="flex-item wide contract grow" onClick={() => this.redirect(`/contracts/${contract.data.address}`)}>
                    <div className="type">Owner</div>
                    <Blockies seed={contract.data.address} size={10} scale={14} bgColor="#fff" />
                    <div className="content">
                      <div className="address">{this.shortAddress(contract.data.address)}</div>
                      <div className="partyB">
                        <div className="identicon">
                          <Blockies seed={contract.data.partyA} size={5} scale={4} bgColor="#f5f5f5" />
                        </div>
                        <div className="content">
                          {this.shortAddress(contract.data.partyA)}
                        </div>

                        <div>&nbsp;&nbsp;</div>

                        <div className="identicon">
                          <Blockies seed={contract.data.partyB} size={5} scale={4} bgColor="#f5f5f5" />
                        </div>

                        <div className="content">
                          {this.shortAddress(contract.data.partyB)}
                        </div>

                      </div>
                      <div className="description">{contract.data.description.slice(0, 50)}</div>
                    </div>
                  </div>
                }

                {
                  contracts.data.map((contract, i) =>
                    <div className="flex-item wide contract grow" key={contract._id} onClick={() => this.redirect(`/contracts/${contract.address}`)}>
                      {contract.partyA === accounts.data[0] && <div className="type">Owner</div>}
                      <Blockies seed={contract.address} size={10} scale={14} bgColor="#fff" />
                      <div className="content">
                        <div className="address">{this.shortAddress(contract.address)}</div>
                        <div className="partyB">
                          <div className="identicon">
                            <Blockies seed={contract.partyA} size={5} scale={4} bgColor="#f5f5f5" />
                          </div>
                          <div className="content">
                            {this.shortAddress(contract.partyA)}
                          </div>

                          <div>&nbsp;&nbsp;</div>

                          <div className="identicon">
                            <Blockies seed={contract.partyB} size={5} scale={4} bgColor="#f5f5f5" />
                          </div>

                          <div className="content">
                            {this.shortAddress(contract.partyB)}
                          </div>

                        </div>
                        <div className="description">{contract.description.slice(0, 50)}</div>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
            ),
            failed: contract.failedLoading && 'failedLoading'
        })}
        <div className="footer" />
      </div>
    )
  }
}

export default connect(
  state => ({
    balance: state.wallet.balance,
    contract: state.contract.contract,
    contracts: state.contract.contracts ,
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
