import React from 'react'
import Blockies from 'react-blockies'
import { ScaleLoader } from 'react-spinners'

import { redirect, shortAddress } from '../../utils/contract'
import statusContract from '../../utils/status-contract'

/**
 * Contract Display List Component
 * @param randomSeed
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
  history,
  randomSeed
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

    {contract.data &&
      contract.data.address &&
      contract.data.title &&
      !contracts.data.some(c => c.address === contract.data.address) && (
        <div
          className="flex-item2"
          onClick={redirect(`/contracts/${contract.data.address}`, history)}
        >
          <div className="type">Owner</div>

          <div className="content">
            <div className="address">{contract.data.title}</div>
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
        onClick={redirect(`/contracts/${contract.address}`, history)}
      >
        {contract.partyA === accounts.data[0] ? (
          <div className="type">
            Owner
          </div>
        ) : (
          <div />
        )}
        <div className="content">
          <div className="address">{contract.title}</div>
        </div>
        <div className="status">
            {statusContract(contract, accounts.data[0]).status}
        </div>
      </div>
    ))}

    {contracts.data.length === 0 &&
      !(contract.data && contract.data.address) &&
      !contract.creating && (
        <div className="flex-container-main-newContract-container">
          <div
            className="flex-container-main-newContract-container-content"
            onClick={redirect('/contracts/new', history)}
          >
            New Contract
          </div>
        </div>
      )}
  </div>
)
