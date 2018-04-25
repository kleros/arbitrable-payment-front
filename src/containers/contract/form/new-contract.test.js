import setupIntegrationTest from '../../../bootstrap/setup-integration-test'

beforeEach(() => {
  setupIntegrationTest({ router: { location: '/' } })
})

it('New contract test', async () => {
  expect(true)
})
