import setupIntegrationTest from '../../../bootstrap/setup-integration-test'

let integration = {
  store: null,
  history: null,
  dispatchSpy: null,
  mountApp: null
}

beforeEach(() => {
  integration = setupIntegrationTest({ router: { location: '/' } })
})

it('New contract test', async () => {
  expect(true)
})
