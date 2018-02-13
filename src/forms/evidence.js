import { wizardForm } from '../utils/form-generator'
import { required, number } from '../utils/validation'

export const {
  Form: CreateEvidenceForm,
  isInvalid: getCreateEvidenceFormIsInvalid,
  submit: submitCreateEvidenceForm
} = wizardForm('createEvidenceFormKey', {
  step1: {
    name: {
      type: 'text'
    }
  },
  step2: {
    description: {
      type: 'text'
    }
  },
  step3: {
    url: {
      type: 'text'
    }
  }
})
