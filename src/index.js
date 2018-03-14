import React from 'react'
import ReactDOM from 'react-dom'

import App from './bootstrap/app'
import registerServiceWorker from './bootstrap/register-service-worker'
import { configuredStore, configuredHistory } from './store'

// Random number is used so hot reloading works with `react-loadable`
const render = Component => {
  ReactDOM.render(
    <Component
      key={process.env.NODE_ENV === 'development' ? Math.random() : undefined}
      store={configuredStore}
      history={configuredHistory}
    />,
    document.getElementById('root')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./bootstrap/app', () => {
    render(App)
  })
}

registerServiceWorker()
