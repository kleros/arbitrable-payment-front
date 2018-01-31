import _ from 'lodash'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as walletActions from '../../actions/wallet'
import * as contractActions from '../../actions/contract'
import * as walletSelectors from '../../reducers/wallet'
import * as contractSelectors from '../../reducers/contract'
import { objMap } from '../../utils/functional'
import { renderIf } from '../../utils/react-redux'
import Identicon from '../../components/identicon'

import './balance.css'

class Balance extends PureComponent {
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
    const {
      fetchBalance,
      fetchContracts
    } = this.props
    fetchBalance()
    fetchContracts()
  }

  render() {
    const {
      balance,
      contract,
      loadingContract
     } = this.props

    return (
      <div className="Balance">
        <div className="Balance-message">
          <b>Hello CryptoWorld</b>
        </div>
        <br />
        <br />
        <div className="Balance-message">
          {renderIf(
            [contract.creating],
            [contract.data],
            [contract.failedLoading],
            {
              loading: (
                <span>
                  loading
                </span>
              ),
              done: contract.data && (
                <span>
                  {objMap(contract.data, (value, key) => (
                    <div key={key}>
                      {key}: {JSON.stringify(value)}
                    </div>
                  ))}
                </span>
              ),
              failed: contract.failedLoading && 'failedLoading'
            }
          )}
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
    fetchContracts: contractActions.fetchContracts
  }
)(Balance)
