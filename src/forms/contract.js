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
    fileAgreement: {
      type: 'filePicker'
    }
  },
  step4: {
    partyB: {
      type: 'text',
      props: {
        placeholder: 'Seller address'
      }
    }
  },
  step5: {
    payment: {
      type: 'number',
      props: {
        placeholder: 'Payment (ETH)',
        type: 'number'
      },
      validate: [required, number]
    }
  },
  step6: {
    email: {
      type: 'text'
    }
  }
})
