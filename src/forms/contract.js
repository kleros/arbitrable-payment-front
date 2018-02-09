import { wizardForm } from '../utils/form-generator'
import { required, number } from '../utils/validation'

export const {
  Form: CreateContractForm,
  isInvalid: getCreateContractFormIsInvalid,
  submit: submitCreateContractForm
} = wizardForm('createContractFormKey', {
  step1: {
    partyB: {
      type: 'text',
      placeholder: 'Ethereum address of the other party'
    }
  },
  step2: {
    payment: {
      type: 'number',
      placeholder: 'Payment (ETH)',
      validate: [required, number]
    }
  },
  step3: {
    email: {
      type: 'text'
    }
  },
  step4: {
    description: {
      type: 'text'
    }
  }
})
