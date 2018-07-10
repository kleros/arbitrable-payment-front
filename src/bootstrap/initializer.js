import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as walletActions from '../actions/wallet'
import * as walletSelectors from '../reducers/wallet'
import RequiresMetaMask from '../components/requires-meta-mask'
import MissingArbitrator from '../components/missing-arbitrator'

import { eth, ARBITRATOR_ADDRESS, initializeKleros } from './dapp-api'

class Initializer extends PureComponent {
  static propTypes = {
    accounts: walletSelectors.accountsShape.isRequired,
    fetchAccounts: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired
  }

  state = {
    isWeb3Loaded: eth.accounts !== undefined,
    initialized: false
  }

  async componentDidMount() {
    const { fetchAccounts } = this.props

    await initializeKleros() // Kleros must be initialized before fetchAccounts as accounts trigger notification sagas
    fetchAccounts()

    this.setState({ initialized: true })
  }

  render() {
    const { isWeb3Loaded, initialized } = this.state
    const { accounts, children } = this.props

    if (initialized && !accounts.loading) {
      if (!accounts.data) return <RequiresMetaMask needsUnlock={isWeb3Loaded} />
      if (!ARBITRATOR_ADDRESS) return <MissingArbitrator />

      return (<div>{children}</div>)
    } else return 'Loading...'
  }
}

export default connect(
  state => ({
    accounts: state.wallet.accounts
  }),
  { fetchAccounts: walletActions.fetchAccounts }
)(Initializer)
