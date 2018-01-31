import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as walletActions from '../../actions/wallet'
import * as contractActions from '../../actions/contract'
import * as walletSelectors from '../../reducers/wallet'
import * as contractSelectors from '../../reducers/contract'
import { renderIf } from '../../utils/react-redux'
import Identicon from '../../components/identicon'

import './balance.css'

class Balance extends PureComponent {
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
      contract
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
                  address: {contract.data.address}
                  partyB: {contract.data.partyB}
                  status: {contract.data.status}
                </span>
              ),
              failed: contract.data && 'failedLoading'
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
    fetchBalance: walletActions.fetchBalance
  }
)(Balance)
