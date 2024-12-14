import React from 'react';
import './loader.css';

import logo from '../img/iconoCruzFarmaciaVerde.png'
const Loader = () => {
  return (
    <div className="containerLoader">
      <div className="loader"><img src={logo} alt="Logo cruz verde" /></div>
    </div>
  )
}
export default Loader;