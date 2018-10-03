import React from 'react'

import { redirect } from '../../utils/contract'
import './nav-header.css'
import logo from './logo_kleros.png'

export const NavHeader = ({ history }) => (
  <div className="flex-container-main-menu">
    <div className="flex-container-main-menu-left">
      <div
        className="flex-container-main-menu-left-home"
        onClick={redirect('/', history)}
      >
        Home
      </div>
    </div>

    <div className="flex-container-main-menu-center">
      <img className="navHeader-logo" src={logo} alt="Logo Kleros" />
    </div>

    <div className="flex-container-main-menu-right">
      <div
        className="flex-container-main-menu-right-item"
        onClick={redirect('/contracts/new', history)}
      >
        New contract
      </div>
    </div>
  </div>
)
