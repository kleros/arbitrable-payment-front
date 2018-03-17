import configureStore from './bootstrap/configure-store'

const { store, history } = configureStore()

export const configuredStore = store
export const configuredHistory = history
