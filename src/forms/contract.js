import { wizardForm } from '../utils/form-generator'
import { required, number } from '../utils/validation'

export const {
  Form: CreateContractForm,
  isInvalid: getCreateContractFormIsInvalid,
  submit: submitCreateContractForm
} = wizardForm('createContractFormKey', {
  step1: {
    title: {
      type: 'text'
    }
  },
  step2: {
    description: {
      type: 'textarea'
    }
  },
  step3: {
    partyB: {
      type: 'text',
      props: {
        placeholder: 'Other Party address'
      }
    }
  },
  step4: {
    payment: {
      type: 'number',
      props: {
        placeholder: 'Payment (ETH)',
        type: 'number'
      },
      validate: [required, number]
    }
  },
  step5: {
    email: {
      type: 'text'
    }
  }
})
