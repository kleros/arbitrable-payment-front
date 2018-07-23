/**
 * return extra contract status
 * @param contract
 * @param accountAddress
 * @return object
 */
export default function statusContract(contract, accountAddress) {
  if (contract.partyBFee > 0 && contract.partyBFee > 0) {
    return {
      color: '#66ccff',
      status: 'dispute active',
      class: 'evidence'
    }
  }
  if (
    contract.partyB === accountAddress &&
    contract.partyAFee > 0 &&
    contract.partyBFee === 0
  ) {
    return {
      color: '#ff9933',
      status: 'pay fee',
      class: 'payFee'
    }
  }
  if (
    contract.partyA === accountAddress &&
    contract.partyBFee > 0 &&
    contract.partyAFee === 0
  ) {
    return {
      color: '#ff9933',
      status: 'pay fee',
      class: 'payFee'
    }
  }
  if (contract.partyB === accountAddress && contract.partyBFee > 0) {
    return {
      color: '#ffcc66',
      status: 'wait fee',
      class: 'waitFee'
    }
  }
  if (contract.partyA === accountAddress && contract.partyAFee > 0) {
    return {
      color: '#ffcc66',
      status: 'wait fee',
      class: 'waitFee'
    }
  }
  return {
    color: '#fff',
    status: '',
    class: ''
  }
}
