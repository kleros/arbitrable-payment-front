import Eth from 'ethjs'
import { Kleros } from 'kleros-api'

const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
export const ARBITRATOR_ADDRESS =
  process.env[`REACT_APP_${env}_ARBITRATOR_ADDRESS`]

let ethInstance
if (process.env.NODE_ENV === 'test')
  ethInstance = new Eth(require('ethereumjs-testrpc').provider())
else if (window.web3 && window.web3.currentProvider)
  ethInstance = new Eth(window.web3.currentProvider)
else
  ethInstance = new Eth.HttpProvider(
    process.env[`REACT_APP_${env}_ETHEREUM_PROVIDER`]
  )

export const eth = ethInstance

const kleros = new Kleros(
  ethInstance.currentProvider,
  process.env.REACT_APP_STORE_PROVIDER,
  ARBITRATOR_ADDRESS
)

export default kleros

eth.accounts((error, accounts) => {
  if (error) {
  }
  kleros.watchForEvents(accounts[0])
})
