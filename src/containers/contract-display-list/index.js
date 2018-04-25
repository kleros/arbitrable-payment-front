import React from 'react'
import Blockies from 'react-blockies'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'

import { redirect, shortAddress } from '../../utils/contract'
import * as contractSelectors from '../../reducers/contract'

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
        className="flex-item wide grow"
        onClick={redirect(`/contracts/${contract.address}`, history)}
      >
        <Blockies seed={randomSeed} size={10} scale={14} bgColor="#fff" />
        <div className="creationContentContract">
          <div>Contract creation</div>
        </div>
      </div>
    )}

    {contract.data &&
      contract.data.address &&
      contract.data.title &&
      !contracts.data.some(c => c.address === contract.data.address) && (
        <div
          className="flex-item wide contract grow"
          onClick={redirect(`/contracts/${contract.data.address}`, history)}
        >
          <div className="type">Owner</div>
          <Blockies
            seed={contract.data.address}
            size={10}
            scale={14}
            bgColor="#fff"
          />

          <div className="content">
            <div className="address">{contract.data.title}</div>
            <div className="partyB">
              <div className="identicon">
                <Blockies
                  seed={contract.data.partyA}
                  size={5}
                  scale={4}
                  bgColor="#f5f5f5"
                />
              </div>
              <div className="content">
                {shortAddress(contract.data.partyA)}
              </div>

              <div>&nbsp;&nbsp;</div>

              <div className="identicon">
                <Blockies
                  seed={contract.data.partyB}
                  size={5}
                  scale={4}
                  bgColor="#f5f5f5"
                />
              </div>
              <div className="content">
                {shortAddress(contract.data.partyB)}
              </div>
            </div>
            <div className="description">
              {contract.data.description.slice(0, 50)}
            </div>
          </div>
        </div>
      )}

    {contracts.data.map((contract, i) => (
      <div
        className="flex-item wide contract grow"
        key={contract._id}
        onClick={redirect(`/contracts/${contract.address}`, history)}
      >
        {contract.partyA === accounts.data[0] && (
          <div className="type">Owner</div>
        )}
        <Blockies seed={contract.address} size={10} scale={14} bgColor="#fff" />
        <div className="content">
          <div className="address short">{contract.title}</div>
          <div className="partyB">
            <div className="identicon">
              <Blockies
                seed={contract.partyA}
                size={5}
                scale={4}
                bgColor="#f5f5f5"
              />
            </div>
            <div className="content">{shortAddress(contract.partyA)}</div>

            <div>&nbsp;&nbsp;</div>

            <div className="identicon">
              <Blockies
                seed={contract.partyB}
                size={5}
                scale={4}
                bgColor="#f5f5f5"
              />
            </div>

            <div className="content">{shortAddress(contract.partyB)}</div>
          </div>
          <div className="description">{contract.description.slice(0, 50)}</div>
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

ContractDisplayList.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  contract: contractSelectors.contractShape.isRequired,
  history: ReactRouterPropTypes.history.isRequired
}
