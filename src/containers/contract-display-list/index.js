import React from 'react'
import FA from 'react-fontawesome'

import { redirect } from '../../utils/contract'
import statusContract from '../../utils/status-contract'

/**
 * Contract Display List Component
 * @param contract
 * @param props - e.g. must receive this.props with a history field
 * @param accounts
 * @returns {*}
 * @constructor
 */
export const ContractDisplayList = ({
  accounts,
  contracts,
  contract,
  history
}) => (
  <div className="flex-container">
    {contract.data && !contracts.some(obj => obj.arbitrableTransactionId === contract.data.arbitrableTransactionId) && (
      <div
        className="flex-item2"
        onClick={redirect(`/contracts/${localStorage.getItem('arbitrableTransactionId')}`, history)}
      >
        <div className="type">Owner</div>

        <div className="content">
          <div className="address">{localStorage.getItem('arbitrableTransactionTitle')}</div>
        </div>

        <div className="status">
          {statusContract(contract, accounts.data[0].toLowerCase()).status}
        </div>
      </div>
    )}

    {contracts.map((contractArr, i) => (
      <div
        className={`flex-item2`}
        key={i}
        onClick={redirect(
          `/contracts/${contractArr.arbitrableTransactionId}`,
          history
        )}
      >
        {contractArr.buyer === accounts.data[0].toLowerCase() ? (
          <div className="type">Owner</div>
        ) : (
          <div />
        )}
        <div className="content">
          <div className="address">{contractArr.metaEvidence.title}</div>
        </div>
        <div className="status">
          {statusContract(contractArr, accounts.data[0].toLowerCase()).status}
        </div>
      </div>
    ))}

    {contracts.length === 0 &&
      !(contract.data && contract.data.address) &&
      !contract.creating && (
        <div
          className="flex-item2 newContract"
          onClick={redirect('/contracts/new', history)}
        >
          <FA name="plus" size="2x" />
        </div>
      )}
  </div>
)
