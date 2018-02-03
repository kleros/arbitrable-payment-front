import _ from 'lodash'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
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
    randomSeed: ""
  }

  timer = () => (this.setState({randomSeed: Math.random().toString(36).substring(6).toString()}))

  componentWillUnmount(){
    clearInterval(this.intervalId);
  }

  static propTypes = {
    loadingContracts: PropTypes.bool,
    contract: contractSelectors.contractShape.isRequired,
    creatingContract: PropTypes.bool,
    fetchContracts: PropTypes.func.isRequired,

    balance: walletSelectors.balanceShape.isRequired,
    fetchBalance: PropTypes.func.isRequired
  }

  static defaultProps = {
    loadingContracts: false
  }

  componentDidMount() {
    this.intervalId = setInterval(this.timer, 100);
    const { fetchBalance, fetchContracts } = this.props
    fetchBalance()
    fetchContracts()
  }



  render() {
    const {
      balance,
      contract,
      loadingContract,
      contracts
    } = this.props

    return (
      <div className="container">
        {renderIf(
          [balance.loading],
          [balance.data && contracts.data],
          [balance.failedLoading],
          {
            loading: <span>loading</span>,
            done: contracts.data && (
              <div className="flex-container">
                <div className="flex-item wide contract grow">
                  <div className="type">Profile</div>
                  <Blockies seed="Jeremy" size={10} scale={14} bgColor="#fff" />
                  <div className="content">
                    <div className="address">{'0x4d010...87f'}</div>
                    <div className="balance">{balance.data} ETH</div>
                    <div className="activate_pnk">Activate</div>
                  </div>
                </div>


                <div className="flex-item wide grow newContract">
                  <Link to="/new-contract">New Contract</Link>
                </div>

                {console.log(contracts.data)}

                {
                  contracts.data.map((contract, i) =>
                    <div className="flex-item wide contract grow">
                      <Blockies seed={contract.address} size={10} scale={14} bgColor="#fff" />
                      <div className="content">
                        <div className="address">{'0x4d010...87f'}</div>
                        <div className="partyB">
                          <div>
                            <Blockies seed={contract.address} size={5} scale={4} bgColor="#f5f5f5" />
                          </div>
                          <div className="content">
                            0xeb3ddf7e...2badddd071d6
                          </div>
                        </div>
                        <div className="description">Contract description wddwe f wefewfewfe fewew fweffew</div>
                      </div>
                    </div>
                  )
                }

                {contract.creating &&
                  <div className="flex-item wide grow" onClick={v => v}>
                    <Blockies seed={this.state.randomSeed} size={10} scale={14} bgColor="#fff" />
                    <div className="creationContentContract">
                      <div>
                        Contract creation
                      </div>
                    </div>
                  </div>
                }

                {contract.data &&
                  <div className="flex-item wide contract grow">
                    <div className="type">Dispute created</div>
                    <Blockies seed={contract.address} size={10} scale={14} bgColor="#fff" />
                    <div className="content">
                      <div className="address">{'0x4d...8d7f'}</div>
                      <div className="balance"><i class="em em-bust_in_silhouette"></i>{contract.data.partyA}</div>
                      <div className="balance">B: {contract.data.partyB}</div>
                      <div className="activate_pnk">Activate</div>
                    </div>
                  </div>
                }
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
    contracts: state.contract.contracts
  }),
  {
    fetchBalance: walletActions.fetchBalance,
    fetchContracts: contractActions.fetchContracts
  }
)(Home)
