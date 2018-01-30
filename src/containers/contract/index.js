import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as walletActions from '../../actions/wallet'
import * as contractActions from '../../actions/contract'
import * as walletSelectors from '../../reducers/wallet'
import * as contractSelectors from '../../reducers/contract'
import { renderIf } from '../../utils/react-redux'
import {
  CreateContractForm,
  getCreateContractIsInvalid,
  submitCreateContract
} from '../../forms/contract'
import Identicon from '../../components/identicon'
import Button from '../../components/button'


import './contract.css'

class Contract extends PureComponent {
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
      loadingContracts,
      creatingContract,
      contract,
      createContractIsInvalid,
      fetchContracts,
      submitCreateContract,
      createContract
    } = this.props

    return (
      <div className="Balance">
        <div className="Balance-message">
          <b>Hello CryptoWorld</b>
          <CreateContractForm onSubmit={createContract} />
            <Button
              label="Create"
              onClick={submitCreateContract}
            >
              Create
            </Button>
        </div>
        <br />
        <br />
        <div className="Balance-message">
          {renderIf(
            [balance.loading],
            [balance.failedLoading],
            {
              loading: 'Loading...',
              done: (
                <span>
                  Welcome <Identicon seed="Placeholder" />, You have{' '}
                  {balance.data && balance.data.toString()} ETH.
                </span>
              ),
              failed: (
                <span>
                  There was an error fetching your balance. Make sure{' '}
                  <a
                    className="Balance-message-link"
                    href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
                  >
                    MetaMask
                  </a>{' '}
                  is unlocked and refresh the page.
                </span>
              )
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
    createContract: contractActions.createContract,
    submitCreateContract,
  }
)(Contract)
