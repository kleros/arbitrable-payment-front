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
      props: {
        placeholder: 'Other Party address'
      }
    }
  },
  step2: {
    payment: {
      type: 'number',
      props: {
        placeholder: 'Payment (ETH)',
        type: 'number'
      },
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
