import React from 'react'

import { redirect } from '../../utils/contract'

export const NavHeader = ({history}) => (
  <div className="flex-container-main-menu">
    <div className="flex-container-main-menu-items">
      <div
        className="flex-container-main-menu-items-item flex-container-main-menu-items-kleros"
        onClick={redirect('/', history)}
      >
        KLEROS
      </div>
      <div className="flex-container-main-menu-items-item"
           onClick={redirect('/profile', history)}>
        Profile
      </div>
      <div
        className="flex-container-main-menu-items-item"
        onClick={redirect('/contracts/new', history)}
      >
        New contract
      </div>
    </div>
  </div>)
