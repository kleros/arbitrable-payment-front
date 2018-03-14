import React from 'react'

import './kleros-gitter.css'
import logo from './logo_kleros.png'

const KlerosGitter = () => (
  <div className="Kleros-gitter">
    <a
      target="_blank"
      href="https://gitter.im/kleros/Lobby"
      alt="Gitter kleros"
    >
      <img className="Kleros-gitter-logo" src={logo} alt="Logo Kleros Gitter" />
    </a>
  </div>
)

export default KlerosGitter
