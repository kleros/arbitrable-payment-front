import setupIntegrationTest, {
  flushPromises
} from '../../bootstrap/setup-integration-test'

import Profile from '.'

let integration = {
  store: null,
  history: null,
  dispatchSpy: null,
  mountApp: null
}

beforeEach(() => {
  integration = setupIntegrationTest({ router: { location: '/profile' } })
})
