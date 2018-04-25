import setupIntegrationTest from '../../../bootstrap/setup-integration-test'

beforeEach(() => {
  setupIntegrationTest({ router: { location: '/' } })
})

it('New evidence test', async () => {
  expect(true)
})
