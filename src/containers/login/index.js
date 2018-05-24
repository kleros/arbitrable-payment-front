import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as authActions from '../../actions/auth'
import { renderIf } from '../../utils/react-redux'
import { HomeKlerosFooter } from '../../components/home-kleros-footer'

import './login.css'

class Login extends PureComponent {
  static propTypes = {
    authToken: PropTypes.string,
    fetchNewToken: PropTypes.func.isRequired,
  }

  static defaultProps = {
    validatingToken: false
  }

  login() {
    const { fetchNewToken } = this.props
    fetchNewToken()
  }

  getDerivedStateFromProps(nextProps) {
    // redirect to home if we are logged in
    if (nextProps.tokenValid)
      console.log("redirect here....")
  }

  render() {
    return (
      <div className="container">
        <div className="flex-container-main">
          <div className="login-box">
            <p>In order to use the Kleros Juror User Interface you need to
            sign an auth token so that you can safely interact with our off-chain storage server.
            This server stores non-essential dispute metadata to improve the user experience of the
            dashboard. Please click login and sign the token with your web3 client to continue. Thanks!
            </p>
            <div className="login-btn" onClick={() => this.login()}>Login</div>
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
    tokenValid: state.auth.tokenValid
  }),
  {
    fetchNewToken: authActions.fetchNewToken
  }
)(Login)
