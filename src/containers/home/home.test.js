import setupIntegrationTest from '../../bootstrap/setup-integration-test'

beforeEach(() => {
  setupIntegrationTest({ router: { location: '/' } })
})

it('Home test', async () => {
  expect(true)
})
