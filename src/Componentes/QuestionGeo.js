import React from 'react';
import './questionGeo.css';

function QuestionGeo({ubication,setUbication,setQuestion,question}){

  function handleCheck(){
    setQuestion(false);
    setUbication(true);
  }

  function handleCancel(){
    setQuestion(false);
    setUbication(false);
    
  }
  return (
    <div className="contanier-geo">
      <div className="cuadro-question">
        <div className="cuadro-text">
          <p>¿Desea permitir que la aplicación acceda a su ubicación para calcular la distancia a las farmacias de turno más cercanas?</p>
          <p>Puede desactivar esta opción en el menú en cualquier momento.</p>
          
        </div>
          <div className="container-btn-geo">
            <button onClick={handleCheck}>
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#148f77"><path d="M480-80q-84.33 0-157.33-30.83-73-30.84-127-84.84t-84.84-127Q80-395.67 80-480q0-83.67 30.83-156.67 30.84-73 84.84-127t127-85.16Q395.67-880 480-880q71.67 0 134.33 22.33Q677-835.33 728-796l-48 48.33q-42-31.33-92.33-48.5-50.34-17.16-107.67-17.16-141 0-237.17 96.16Q146.67-621 146.67-480t96.16 237.17Q339-146.67 480-146.67t237.17-96.16Q813.33-339 813.33-480q0-26-3.66-51-3.67-25-11-48.67L851-632q14.33 35.33 21.67 73.33 7.33 38 7.33 78.67 0 84.33-31.17 157.33-31.16 73-85.16 127t-127 84.84Q563.67-80 480-80Zm-58-217.33L255.33-464.67 304-513.33l118 118L831.33-805l49.34 48.67-458.67 459Z"/></svg>
            </button>
            <button onClick={handleCancel}>
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FF0000"><path d="m332-285.33 148-148 148 148L674.67-332l-148-148 148-148L628-674.67l-148 148-148-148L285.33-628l148 148-148 148L332-285.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z"/></svg>
            </button>
          </div>
      </div>
    </div>
  )
}
export default QuestionGeo;