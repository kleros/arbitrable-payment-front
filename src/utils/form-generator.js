import { configuredStore } from '../store' // eslint-disable-line unicorn/import-index
import TextInput from '../components/text-input'
import TextareaInput from '../components/textarea-input'

import createFormGenerator from './create-form-generator'

export const {form, wizardForm} = createFormGenerator(
  {textarea: TextareaInput, text: TextInput, number: TextInput},
  configuredStore
)
