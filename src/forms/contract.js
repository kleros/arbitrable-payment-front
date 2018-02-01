import { wizardForm, form } from '../utils/form-generator'
import { required, number } from '../utils/validation'

export const {
  Form: CreateContractForm,
  isInvalid: getCreateContractIsInvalid,
  submit: submitCreateContract
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
      validate: [required, number]
    }
  },
  step3: {
    partyB: {
      type: 'text',
      formValues: 'arbitratorExtraData',
      visibleIf: 'email'
    }
  },
  step4: {
    arbitratorExtraData: {
      type: 'text',
      visibleIf: '!payment'
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
