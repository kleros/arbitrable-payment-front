import setupIntegrationTest, {
  flushPromises
} from '../../bootstrap/setup-integration-test'

import Home from '.'

let integration = {
  store: null,
  history: null,
  dispatchSpy: null,
  mountApp: null
}

beforeEach(() => {
  integration = setupIntegrationTest({ router: { location: '/' } })
})

it('Renders and loads balance correctly.', async () => {
  const app = integration.mountApp()
  await flushPromises()
  app.update()
  expect(app.find(Home).text()).toBe(
    'Hello CryptoWorldWelcome [Blockies], You have 100 ETH.'
  )
})
