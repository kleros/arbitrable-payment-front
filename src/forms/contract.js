import { wizardForm } from '../utils/form-generator'
import { required, number } from '../utils/validation'

export const {
  Form: CreateContractForm,
  isInvalid: getCreateContractFormIsInvalid,
  submit: submitCreateContractForm
} = wizardForm('createContractFormKey', {
  step1: {
    payment: {
      type: 'number',
      placeholder: 'Payment (ETH)',
      validate: [required, number]
    }
  },
  step2: {
    timeout: {
      type: 'number',
      visibleIf: 'payment',
      placeholder: 'Timeout',
      validate: [required, number]
    }
  },
  step3: {
    partyB: {
      type: 'text',
      placeholder: 'Timeout'
    }
  },
  step4: {
    arbitratorExtraData: {
      type: 'text'
    }
  },
  step5: {
    email: {
      type: 'text'
    }
  },
  step6: {
    description: {
      type: 'text'
    }
  }
})
