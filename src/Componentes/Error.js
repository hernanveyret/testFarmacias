import React from 'react';
import './error.css';

const Error = ({setError}) => {
  return (
    <div className="contanier-geo">
      <div className="cuadro-question">
        <div className="cuadro-text">
          <p>La ubicación no está activada en su dispositivo. Por favor, actívela para calcular la distancia a las farmacias y vuelva a activar la funcion.</p>          
        </div>
          <div className="container-btn-error">
            <button className="btn-cerrar-error" onClick={() => { setError(false)}}>CERRAR</button>
          </div>
      </div>
    </div>
  )
}
export default Error;