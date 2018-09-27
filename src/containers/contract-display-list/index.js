import React from 'react'
import { ScaleLoader } from 'react-spinners'
import FA from 'react-fontawesome'

import { redirect, shortAddress } from '../../utils/contract'
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
    {contract.creating && (
      <div
        className="flex-item2 loader-contract"
        onClick={redirect(`/contracts/${contract.address}`, history)}
      >
        <ScaleLoader color={'white'} loading={1} />
      </div>
    )}

    {contract.data && (
      <div
        className="flex-item2"
        onClick={redirect(`/contracts/${contract.data.arbitrableTransactionId}`, history)}
      >
        <div className="type">Owner</div>

        <div className="content">
          <div className="address">{contract.data.metaEvidence.title}</div>
        </div>

        <div className="status">
          {statusContract(contract, accounts.data[0]).status}
        </div>
      </div>
    )}

    {contracts.data.map((contract, i) => (
      <div
        className={`flex-item2`}
        key={i}
        onClick={redirect(
          `/contracts/${contract.arbitrableTransactionId}`,
          history
        )}
      >
        {contract.buyer === accounts.data[0] ? (
          <div className="type">Owner</div>
        ) : (
          <div />
        )}
        <div className="content">
          <div className="address">{contract.metaEvidence.title}</div>
        </div>
        <div className="status">
          {statusContract(contract, accounts.data[0]).status}
        </div>
      </div>
    ))}

    {contracts.data.length === 0 &&
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
