import formGenerator from '../utils/form-generator'

export const {
  Form: CreateContractForm,
  isInvalid: getCreateContractIsInvalid,
  submit: submitCreateContract
} = formGenerator('createContractFormKey', {
  payment: {
    type: 'number',
    placeholder: 'Payment (ETH)'
  },
  timeout: {
    type: 'number'
  },
  partyB: {
    type: 'text'
  },
  arbitratorExtraData: {
    type: 'text'
  },
  email: {
    type: 'text'
  },
  description: {
    type: 'text'
  }
})
