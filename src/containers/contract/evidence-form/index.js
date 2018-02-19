import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as walletSelectors from '../../../reducers/wallet'
import * as walletActions from '../../../actions/wallet'
import * as contractSelectors from '../../../reducers/contract'
import * as contractActions from '../../../actions/contract'
import {
  CreateEvidenceForm,
  getCreateEvidenceFormIsInvalid,
  submitCreateEvidenceForm
} from '../../../forms/evidence'
import Button from '../../../components/button'

import './new-evidence.css'

class NewEvidence extends PureComponent {
  static propTypes = {
    balance: walletSelectors.balanceShape.isRequired,
    contract: contractSelectors.contractShape.isRequired,
    createEvidenceFormIsInvalid: PropTypes.bool.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    submitCreateEvidenceForm: PropTypes.func.isRequired,
    createEvidence: PropTypes.func.isRequired
  }

  state = { hasPrevPage: null, hasNextPage: null }

  componentDidMount() {
    const { fetchBalance } = this.props
    fetchBalance()
  }

  getBackHandlerRef = ref => (this.backHandler = ref)

  handlePageChange = ({ hasPrevPage, hasNextPage }) =>
    this.setState({ hasPrevPage, hasNextPage })

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const { submitCreateEvidenceForm } = this.props
      submitCreateEvidenceForm()
    }
  }

  render() {
    const {
      createEvidenceFormIsInvalid,
      submitCreateEvidenceForm,
      createEvidence,
      contract
    } = this.props
    const { hasPrevPage, hasNextPage } = this.state

    return (
      <div className="NewContract">
        <div className="Contract-form" onKeyPress={this.handleKeyPress}>
          <CreateEvidenceForm
            backHandlerRef={this.getBackHandlerRef}
            onPageChange={this.handlePageChange}
            onSubmit={createEvidence}
            initialValues={{ addressContract: contract.data.address }}
          />
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    balance: state.wallet.balance,
    contract: state.contract.contract,
    evidence: state.contract.evidence,
    createEvidenceFormIsInvalid: getCreateEvidenceFormIsInvalid(state)
  }),
  {
    fetchBalance: walletActions.fetchBalance,
    submitCreateEvidenceForm,
    createEvidence: contractActions.createEvidence
  }
)(NewEvidence)
