import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './peticiones.css';

const Peticiones = ({hora, day,setDay, month, year, setLoader,setMonth,setUbication,ubication,lat1,lon1 }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [array, setArray] = useState([])
  const [letra, setLetra] = useState('')
  
  //const url = 'http://localhost:5000/2024'
  //const url = 'https://raw.githubusercontent.com/hernanveyret/farmaciasDeTurnoSN/main/src/Api/farmacias2024.json'
  const url = 'https://farmacia-servidor.vercel.app/api/farmacias'

  const convertToTime = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(':');
    return new Date(2024, 0, 1, hours, minutes, seconds).getTime();
  };

  const horaActual = convertToTime(hora);
  const inicio = convertToTime('00:00:00');
  const fin = convertToTime('08:30:00');

  useEffect(() => {

    //console.log(new Date())

    setLoader(true);
    axios.get(url)
      .then(response => {
       //console.log(response) 
        setData(response.data);
        setLoader(false);
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
        setError('Hubo un error al obtener los datos.');
        setLoader(false);
      });
  }, [setLoader]);

  // calcular la distancia de la ubicacion del usuario hasta la farmacia.
  function calcularDistancia(lat1,lon1,lat2,lon2){

    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const km = R*c

    function toRad(degrees) {   
      return degrees * (Math.PI / 180)
    }
    /*
    function metros(num){
      let mtrs = Math.round(num * 1000)
      //let mtrs = num.toString().split('').splice(2,3).join('')
        return `${mtrs}`
    }
    
    function kilometros(num){
      let kmts = parseFloat(num.toFixed(1))
      //let kmts = num.toString().split('').splice(0,3).join('');
      return `${kmts}`
    }

    
      if(km < 1 ){
        const mt = metros(km)
        return mt; // distacia en metros
      }else {
        const kmt = kilometros(km)
        return kmt
      }
        */
       return km
  }
//-------------------------------------------------------------------------
useEffect(() => {
  if(horaActual >= inicio && horaActual <= fin){
    //console.log('muestra letra del dia anteior')
    if (data) {
      setLoader(true)
      const newArray = [];
      if(data[year][month][month+1][day-2]){
        data[year][month][month+1][day-2].pharmacies.forEach(e => {
            newArray.push(e);
        });
      }else{
        setLoader(false);
        return
      }

      if(ubication){
        newArray.map(e => e.distance = calcularDistancia(lat1,lon1,e.lat,e.lon))
        newArray.sort((a,b) => a.distance - b.distance )
        newArray.forEach(e => {
          if (e.distance < 99) {
            e.distance = parseFloat(e.distance.toFixed(1)); // Formatea a un decimal si es menor a 99          
        } else {
            e.distance = e.distance % 1 === 0 
                ? `${e.distance}` // Si no tiene decimales, muestra como entero
                : `${e.distance.toFixed(1)}`; // Si tiene decimales, muestra con un decimal
        }

          /*
          if(e.distance < 99){
           e.distance =  parseFloat(e.distance.toFixed(1))
          }
           */
        })
      }    

      setArray(newArray); 
      setLetra(data[year][month][month+1][day-2].dateShift.toUpperCase())
      setLoader(false)
    } 
  }else{
    //console.log('Muestra la letra del dia actual')
  if (data) {
    setLoader(true);
    const newArray = []; 
    if(data[year][month][month+1][day-1]){
      data[year][month][month+1][day-1].pharmacies.forEach(e => {
        newArray.push(e);
      });
      
    }else{
      setLoader(false);
      return
    }

    if(ubication){
      newArray.map(e => e.distance = calcularDistancia(lat1,lon1,e.lat,e.lon))
      newArray.sort((a,b) => a.distance - b.distance )
      newArray.forEach(e => {

        if (e.distance < 99) {
          e.distance = parseFloat(e.distance.toFixed(1)); // Formatea a un decimal si es menor a 99
      } else {
          e.distance = e.distance % 1 === 0 
              ? `${e.distance}` // Si no tiene decimales, muestra como entero
              : `${e.distance.toFixed(1)}`; // Si tiene decimales, muestra con un decimal
      }

        
        /*
        if(e.distance < 99){
         e.distance =  parseFloat(e.distance.toFixed(1))
        }
         */
      })
    }    
    setArray(newArray); 
    setLetra(data[year][month][month+1][day-1].dateShift.toUpperCase());
    setLoader(false);
  }
}

}, [data, month, day, ubication]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div></div>;
  }

  function showDistance(numDistance){
    console.log('funcion ver distancia')
    if(numDistance > 7000.0){
      console.log('es mayor a 7000.0')
      //setUbication(false)
      //window.location.reload(); // recarga la pagina si da un error.
    }else{
      if(numDistance < 1 ){
        return `${ Math.round(numDistance * 1000)} Mt.`
      }else if ( numDistance === 'undefined' ){
        return ''
      }else {
        return `${ numDistance} Km.`
      }
    }
    
  }
  
//<p>{ e.distance < 1 ? `${ Math.round(e.distance * 1000)} Mt.` : `${ e.distance} Km.`}</p>
  return (
    <div className="containerFarmacias">
      <h2>Datos de Farmacias</h2>
      <p>Letra: <span style={{ color: "green", fontWeight: "bold" }}>{letra}</span></p>
      {array.map((e, i) => (
        <div className="items" key={i}>
          <div className="infoItems">
            <p>{e.name}</p>
            <p>{e.address}</p>
            { 
              ubication &&
               
               <p>{showDistance(e.distance)}</p> 
              
            }
            <p>{e.tel}</p>
          </div>
          <div className="btn-container">
          <a href={`https://www.google.com/maps/search/?api=1&query=${e.lat},${e.lon}`} rel="noopener noreferrer" target="_blank" title="Ver en mapa" >
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#EA3323">
              <path d="M480.06-486.67q30.27 0 51.77-21.56 21.5-21.55 21.5-51.83 0-30.27-21.56-51.77-21.55-21.5-51.83-21.5-30.27 0-51.77 21.56-21.5 21.55-21.5 51.83 0 30.27 21.56 51.77 21.55 21.5 51.83 21.5ZM480-80Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z"/>
            </svg>
          </a>  
          </div>
        </div>
      ))}
    </div>
  );
};
export default Peticiones;