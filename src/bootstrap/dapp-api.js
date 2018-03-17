import Eth from 'ethjs'
import { Kleros } from 'kleros-api'

let ethInstance
if (process.env.NODE_ENV === 'test')
  ethInstance = new Eth(require('ethereumjs-testrpc').provider())
else if (window.web3 && window.web3.currentProvider)
  ethInstance = new Eth(window.web3.currentProvider)
else
  ethInstance = new Eth.HttpProvider(
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_PROD_ETHEREUM_PROVIDER
      : process.env.REACT_APP_DEV_ETHEREUM_PROVIDER
  )

export const eth = ethInstance

const kleros = new Kleros(
  ethInstance.currentProvider,
  process.env.REACT_APP_STORE_PROVIDER
)

export default kleros

eth.accounts((error, accounts) => {
  kleros.watchForEvents(
    process.env.REACT_APP_ARBITRATOR_ADDRESS_DEV,
    accounts[0]
  )
})
