/**
 * return extra contract status
 * @param contract
 * @param accountAddress
 * @return object
 */
export default function statusContract(contract, accountAddress) {
  if (contract.amount === 0) {
    return {
      color: '#fff',
      status: 'transaction completed',
      class: 'transactionCompleted'
    }
  }
  if (contract.sellerFee > 0 && contract.buyerFee > 0) {
    return {
      color: '#66ccff',
      status: 'dispute active',
      class: 'evidence'
    }
  }
  if (
    contract.sellerFee === accountAddress &&
    contract.buyerFee > 0 &&
    contract.sellerFee === 0
  ) {
    return {
      color: '#ff9933',
      status: 'pay fee (seller)',
      class: 'payFee'
    }
  }
  if (
    contract.buyer === accountAddress &&
    contract.sellerFee > 0 &&
    contract.buyerFee === 0
  ) {
    return {
      color: '#ff9933',
      status: 'pay fee (buyer)',
      class: 'payFee'
    }
  }
  if (contract.seller === accountAddress && contract.sellerFee > 0) {
    return {
      color: '#ffcc66',
      status: 'wait fee',
      class: 'waitFee'
    }
  }
  if (contract.buyer === accountAddress && contract.buyerFee > 0) {
    return {
      color: '#ffcc66',
      status: 'wait fee',
      class: 'waitFee'
    }
  }
  return {
    color: '#fff',
    status: 'ongoing transaction',
    class: ''
  }
}
