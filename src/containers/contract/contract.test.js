import setupIntegrationTest from '../../bootstrap/setup-integration-test'

beforeEach(() => {
  setupIntegrationTest({ router: { location: '/contract' } })
})

it('New evidence test', async () => {
  expect(true)
})
