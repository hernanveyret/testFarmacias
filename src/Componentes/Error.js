import React from 'react';
import './error.css';

const Error = ({setError,checkError,setIsErrorBannerVisible}) => {

  const closeErrorBanner = () => {
    setError(false);
    if(checkError.current.checked){
      setIsErrorBannerVisible(false) 
    }; 
  }

  return (
    <div className="contanier-geo">
      <div className="cuadro-question">
        <div className="cuadro-text">
          <p>La ubicación no está activada en su dispositivo. Por favor, actívela para calcular la distancia a las farmacias, reinicie o actualice la pagina y vuelva a activar la funcion desde el menu.</p>          
        </div>
        <div className="cuadro-check">
          <input type="checkbox" name="check" ref={checkError}/> <p>No volver a mostrar.</p>
        </div>
          <div className="container-btn-error">
            <button className="btn-cerrar-error" onClick={closeErrorBanner}>CERRAR</button>
          </div>
      </div>
    </div>
  )
}
export default Error;