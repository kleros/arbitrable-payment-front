import setupIntegrationTest from '../../bootstrap/setup-integration-test'

beforeEach(() => {
  setupIntegrationTest({ router: { location: '/profile' } })
})

it('Profile test', async () => {
  expect(true)
})
