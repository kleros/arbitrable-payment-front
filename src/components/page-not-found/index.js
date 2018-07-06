import React, { PureComponent } from 'react'

import { NavHeader } from '../nav-header'
import { KlerosFooter } from '../kleros-footer'
import { redirect } from '../../utils/contract'

import './page-note-found.css'

class PageNotFound extends PureComponent {
  state = {}

  render() {
    const { history } = this.props

    return (
      <div className="container">
        <div className="flex-container-main">
          <NavHeader history={history} />
          <div className="flex-container-main-flex-grow">
            <div className="PageNotFound-message">
              <h1>404</h1>
              <h2>Right place. Wrong page.</h2>
              <div
                className="PageNotFound-redirect"
                onClick={redirect('/', history)}
              >
                <i>Back Towards Justice</i>
              </div>
            </div>
          </div>
          <KlerosFooter />
        </div>
      </div>
    )
  }
}

export default PageNotFound
