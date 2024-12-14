import React, { useState, useEffect, useRef } from 'react';

import Almanac from './Almanac';
import AlmanacDay from './AlmanacDay';
import Settings from './Settings';
import Peticiones from './Peticiones';
import Loader from './Loader';
import Maps from './Maps';
import QuestionGeo from './QuestionGeo';
import Error from './Error';

import './home.css';

const Home = () => {
  const meces = [
    {
      id: 0,
      mes:"Enero"
    },
    {
      id: 1,
      mes:"Febrero"
    },
    {
      id: 2,
      mes:"Marzo"
    },
    {
      id: 3,
      mes:"Abril"
    },
    {
      id: 4,
      mes:"Mayo"
    },
    {
      id: 5,
      mes:"Junio"
    },
    {
      id: 6,
      mes:"Julio"
    },
    {
      id: 7,
      mes:"Agosto"
    },
    {
      id: 8,
      mes:"Septiembre"
    },
    {
      id: 9,
      mes:"Octubre"
    },
    {
      id: 10,
      mes:"Noviembre"
    },
    {
      id: 11,
      mes:"Diciembre"
    },
  ]

  let headerRef = useRef();
  let bodyRef = useRef()
  let fotterRef = useRef()
  let cardHeaderRef = useRef()

  let localConfig = localStorage.getItem('settingsFarmaciaV2');
  console.log(JSON.parse(localConfig))
  /*
  const [ initConfig, setInitConfig ] = useState(() => {
    if(localConfig){
      let contLocalConfig = JSON.parse(localConfig);
        if(contLocalConfig.hasOwnProperty('ubicacion')){
          return contLocalConfig
        } else {
          return {
            ...contLocalConfig,
            advertising: false,
            ubicacion: true,
            question: true
          }
        }
    } else {
      return {
        modoNocturno: false,
        almanacType: true,
        advertising: false,
        ubicacion: true,
        question: true
      }
    }
  })
 */
  
  const [ initConfig, setInitConfig ] = useState(localConfig ? JSON.parse(localConfig) : { 
    modoNocturno: false,
    almanacType: true,
    advertising: false,
    ubicacion: true,
    question: true
  });

  console.log(initConfig)
  
  const [ almanacType, setAlmanacType ] = useState(initConfig.almanacType)
  const [ modoNocturno, setModoNocturno ] = useState(initConfig.modoNocturno)
  const [ ubication, setUbication ] = useState(initConfig.ubicacion)
  const [ question, setQuestion ] = useState(initConfig.question);

  const [ error, setError ] = useState(false)
  const [ loader, setLoader ] = useState(false)
  const [ mapsOn, setMapsOn ] = useState(false)
  const [ fecha, setFecha ] = useState(new Date())
  const [ day, setDay ] = useState(fecha.getDate()); // dia en numero.
  const [ dayString, setDayString ] = useState(fecha.toLocaleString('es-ES', { weekday: 'long' }));
  const [ month, setMonth ] = useState(fecha.getMonth()); // mes en numero.
  //const [ monthString, setMonthString ] = useState(fecha.toLocaleString('es-ES', { month: 'long' }))
  const [ monthString, setMonthString ] = useState(meces.find(m => m.id === month).mes)
  const [ year, setYear ] = useState(fecha.getFullYear()); // año
  const [ cantDiasMes, setCantDiasMes ] = useState(new Date(year, month + 1, 0).getDate()); // Ultimo dia del mes anterior
  const [ celdasVacias, setCeldasVacias ] = useState(new Date(year, month, 1).getDay()) // Posicion del primer dia del mes, del 0 al 6, dom-lun...
  const [ lat1, setLat1 ] = useState(0);
  const [ lon1, setLon1 ] = useState(0);
  
  let hs = fecha.getHours();
  let mn = fecha.getMinutes();
  let ss = fecha.getSeconds()
  const [hora, setHora ] = useState(mn < 9 ? `${hs}:0${mn}:0${ss}`: `${hs}:${mn}:${ss}` );
  /*
  
  // Crea una nueva instancia de Date para el 3 de septiembre de 2024
  const fechaEspecifica = new Date(2024, 8, 3); // El mes es 0-indexado, así que septiembre es 8
  
  // Obtén el nombre del día de la semana en español
  const diaDeLaSemana = fechaEspecifica.toLocaleString('es-ES', { weekday: 'long' });
  
  console.log(diaDeLaSemana); // Por ejemplo, "martes"
  */
 
 /*
 console.log(hora)
  console.log('dia:', day)
  console.log('dia string:',dayString)
  console.log('mes:', month)
  console.log('mes string:', monthString)
  console.log('año:', year)
  console.log('ultimo dia del mes anterior', cantDiasMes) // ultimo dia del mes anterior
  console.log('celvas vacias', celdasVacias); // posicion del primer dia del mes del 0 al 6.
  */


  // Mes anterior
  const handlePrev = () => {
    month === 0 ? setMonth(0) : setMonth(month - 1);
  }
  //Mes siguiente
  const handleNext = () => {
     month === 11 ? setMonth(11) : setMonth(month + 1);
  }
  // Dia  anterior
  const handleChangeDayStringPrev = () => {
    //console.log('prev')
      if(day===1){
        setDay(new Date(year, month, 0).getDate())
        handlePrev()
        return
      }
      setDay(day - 1)
  };

  // Dia siguiente
  const handleChangeDayStringNext = () => {
    if(day===cantDiasMes){
      setDay(1)
      handleNext()
      return
    }
    setDay(day + 1) 
  }
// cambia dayString segun el dia
  useEffect(() => {
    let algo = new Date(year,month,day)
    let diaDeLaSemana = algo.toLocaleString('es-ES', { weekday: 'long' })
    setDayString(diaDeLaSemana)
  },[day,month]);

  useEffect(() => {
    setCantDiasMes(new Date(year, month + 1, 0).getDate())
    setCeldasVacias(new Date(year, month, 1).getDay())
    setMonthString(meces.find(m => m.id === month).mes)
  },[month,year, meces])

  // Selecciona el dia en el almanaque por mes.
  // el metodo trim() elimina los espacios vacios de lo que traiga el target
  const handleDay = (e) => {
    let textContent = e.currentTarget.textContent.trim();
    if (textContent !== '') {      
      textContent = parseInt(textContent)
      setDay(textContent)
    }
  };
  
  const settingOptions = () => {
    const panelSetting = document.getElementById('panelSetting');
    panelSetting.classList.toggle('activatePanel')
  }
  // Cambia el typo de almanaque
  const handleChangeAlmanacType = () => {
    setAlmanacType(prevType => !prevType); 
    settingOptions()
  };
  
  // Cambia el estado de almanaque
  useEffect(() => {
    const updatedConfig = {
      ...initConfig,
      almanacType: almanacType,
    };
  
    setInitConfig(updatedConfig);
    localStorage.setItem('settingsFarmaciaV2', JSON.stringify(updatedConfig));
  }, [almanacType]);

  // Cambia el estado de ubicacion en settings y en el localStorage.
  useEffect(() => {
    
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
    
    const success = ( position ) => {
      setLat1(position.coords.latitude);
      setLon1(position.coords.longitude)
    }
    
    const error = (err) => {
      setUbication(false)
      setError(true)
      console.log('codigo de error: ',err.code)
      console.log('mensage: ',err.message)
    }
    
      if('geolocation' in navigator){      
        navigator.geolocation.getCurrentPosition(success,error,options)
      }else{
        console.log('la geolocalizacion esta desactivada')
      }
    
    const updatedConfig = {
      ...initConfig,
      ubicacion: ubication
    }
      
    setInitConfig(updatedConfig);
    localStorage.setItem('settingsFarmaciaV2', JSON.stringify(updatedConfig));
  },[ubication])

  //Cambia el estado para mostrar el cartel de consulta para la geolocalizacion.
  useEffect(() => {
    const updatedConfig = {
      ...initConfig,
      question: question
    }

    setInitConfig(updatedConfig);
    localStorage.setItem('settingsFarmaciaV2', JSON.stringify(updatedConfig));
  },[question])

  // Cambio de normal a modo nocturno
  useEffect(() => {    
    const updatedConfig = {
      ...initConfig,
      modoNocturno: modoNocturno
    };
    setInitConfig(updatedConfig);
    localStorage.setItem('settingsFarmaciaV2', JSON.stringify(updatedConfig));
    
    if(modoNocturno === true ) {
      headerRef.current.classList.add('activateDarkMode')
      fotterRef.current.classList.add('activateDarkMode')
      bodyRef.current.classList.add('activateDarkModeBody');
        if(cardHeaderRef.current) { // si el componente esta montado activa la clase
          cardHeaderRef.current.classList.add('activateDarkMode');
        }
    }else{
      headerRef.current.classList.remove('activateDarkMode')
      fotterRef.current.classList.remove('activateDarkMode')
      bodyRef.current.classList.remove('activateDarkModeBody');
        if(cardHeaderRef.current){
          cardHeaderRef.current.classList.remove('activateDarkMode');
        }
    }
  },[modoNocturno]);
  
  return (
    <div className="containerHome" ref={bodyRef}>
      { mapsOn && <Maps /> }
         { loader && <Loader />}
      <header ref={headerRef}>
        <a href="https://turnos-de-farmacias-sn.vercel.app/">
          <h1>Farmacias de turno SN</h1>
        </a>
        <button className="btn-menu" onClick={settingOptions} title="Abrir menu">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
        </button>
      </header>
      <main>
            { question && <QuestionGeo 
              question={question} 
              setQuestion={setQuestion}
              ubication={ubication}
              setUbication={setUbication}
              />}

            { error && <Error 
                setError={setError}
            /> }
            <Settings 
              settingOptions={settingOptions}
              handleChangeAlmanacType={handleChangeAlmanacType} 
              setModoNocturno={setModoNocturno}
              modoNocturno={modoNocturno}
              almanacType={almanacType}
              ubication={ubication}
              setUbication={setUbication}
              />
        <article className="almanaque">
          { almanacType ? <Almanac 
              day={day}
              month={month}
              monthString={monthString} 
              year={year} 
              cantDiasMes={cantDiasMes} 
              celdasVacias={celdasVacias} 
              handlePrev={handlePrev} 
              handleNext={handleNext} 
              handleDay={handleDay}
          /> :
            <AlmanacDay 
              day={day}
              month={month}
              monthString={monthString}
              year={year}
              dayString={dayString}
              handlePrev={handlePrev} 
              handleNext={handleNext}
              handleChangeDayStringPrev={handleChangeDayStringPrev}
              handleChangeDayStringNext={handleChangeDayStringNext}
              cardHeaderRef={cardHeaderRef}
              />
          }  
        </article>
        <article className="farmacias">
            <Peticiones
              hora={hora}
              day={day}
              month={month}
              year={year}
              setLoader={setLoader}
              setUbication={setUbication}
              ubication={ubication}
              lat1={lat1}
              lon1={lon1}
            />
        </article>
      </main>
      <footer ref={fotterRef}>
        <p>Diseñado por Hernán Luis Veyret - 2024 - Version 1.2 - hernanveyret@hotmail.com</p>
      </footer>
    </div>
  )
}

export default Home;