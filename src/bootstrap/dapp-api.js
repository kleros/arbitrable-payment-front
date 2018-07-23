import Web3 from 'web3'
import { Kleros } from 'kleros-api'

const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
const ETHEREUM_PROVIDER = process.env[`REACT_APP_${env}_ETHEREUM_PROVIDER`]
const STORE_PROVIDER = process.env[`REACT_APP_${env}_STORE_PROVIDER`]

let web3
if (process.env.NODE_ENV === 'test')
  web3 = new Web3(require('ganache-cli').provider())
else if (window.web3 && window.web3.currentProvider)
  web3 = new Web3(window.web3.currentProvider)
else web3 = new Web3(new Web3.providers.HttpProvider(ETHEREUM_PROVIDER))

let ARBITRATOR_ADDRESS
let kleros
const initializeKleros = async () => {
  const network =
    web3.eth &&
    web3.eth.net
      .getId()
      .then(networkID => {
        switch (networkID) {
          case 1:
            return 'MAINNET'
          case 3:
            return 'ROPSTEN'
          case 4:
            return 'RINKEBY'
          case 42:
            return 'KOVAN'
          default:
            return null
        }
      })
      .catch(() => null)

  ARBITRATOR_ADDRESS =
    process.env[`REACT_APP_${env}_${await network}_ARBITRATOR_ADDRESS`]

  kleros = new Kleros(
    window.web3.currentProvider,
    STORE_PROVIDER,
    ARBITRATOR_ADDRESS
  )
}

const ETHAddressRegExpCaptureGroup = '(0x[a-fA-F0-9]{40})'
const ETHAddressRegExp = /0x[a-fA-F0-9]{40}/
const strictETHAddressRegExp = /^0x[a-fA-F0-9]{40}$/

export {
  web3,
  ARBITRATOR_ADDRESS,
  kleros,
  initializeKleros,
  ETHAddressRegExpCaptureGroup,
  ETHAddressRegExp,
  strictETHAddressRegExp
}

setTimeout(
  () =>
    console.log(
      'Arbitrator Address: ',
      ARBITRATOR_ADDRESS,
      'Kleros: ',
      kleros,
      'Web3: ',
      window.web3
    ),
  1000
)
