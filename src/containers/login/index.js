import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as authActions from '../../actions/auth'
import * as authSelectors from '../../reducers/auth'
import { HomeKlerosFooter } from '../../components/home-kleros-footer'
import Button from '../../components/button'

import './login.css'

class Login extends PureComponent {
  static propTypes = {
    token: authSelectors.tokenShape.isRequired,
    fetchNewAuthToken: PropTypes.func.isRequired,
  }

  login() {
    this.props.fetchNewAuthToken()
  }

  componentWillReceiveProps(nextProps) {
    // redirect to home if we are logged in
    if (nextProps.token.data.isValid)
      this.props.history.push('/')
  }

  render() {
    return (
      <div className="container">
        <div className="flex-container-main">
          <div className="login-box">
            <p>In order to use this Kleros interface you need to
            sign an auth token so that you can safely interact with our off-chain storage server.
            This server stores non-essential dispute metadata to improve the user experience of the
            dashboard. Please click login and sign the token with your web3 client to continue. Thanks!
            </p>
            <Button onClick={this.login.bind(this)} className="login-btn">Login</Button>
          </div>
          <div className="flex-container-main-flex-grow" />
          <HomeKlerosFooter />
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    token: state.auth.token
  }),
  {
    fetchNewAuthToken: authActions.fetchNewAuthToken
  }
)(Login)
