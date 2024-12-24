import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import "./peticiones.css";
import MapaUbicaciones from "./MapaUbicaciones";
import iconoPosicion from '../img/iconoPosicion.svg'

const Peticiones = ({hora, day, month, year, setLoader, ubication, lat1, lon1, modoNocturno}) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [array, setArray] = useState([]);
    const [letra, setLetra] = useState("");
    const [mostrarMapa, setMostrarMapa] = useState(false);

  const url = "https://farmacia-servidor.vercel.app/api/farmacias";

  // Convierte la hora en texto de string a una hora real
  const convertToTime = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return new Date(2024, 0, 1, hours, minutes, seconds).getTime();
  };

  const horaActual = convertToTime(hora);
  const inicio = convertToTime("00:00:00");
  const fin = convertToTime("08:30:00");

    const mapRef = useRef(null);

    const calcularDistancia = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Fetch de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (setLoader) setLoader(true); 
        const response = await axios.get(url);
        setData(response.data);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError("Hubo un error al obtener los datos.");
      } finally {
        if (setLoader) setLoader(false);
      }
    };

    fetchData();
  }, [setLoader]);

  // Filtrar farmacias
  useEffect(() => {
    if (!data) return;

    const isEarlyMorning = horaActual >= inicio && horaActual <= fin;
    const targetDay = isEarlyMorning ? day - 2 : day - 1;
    const pharmaciesData = data[year]?.[month]?.[month + 1]?.[targetDay];

    if (!pharmaciesData) {
      setArray([]);
      return;
    }

    const pharmacies = pharmaciesData.pharmacies.map((pharmacy) => {
      if (ubication) {
        pharmacy.distance = calcularDistancia(lat1,lon1,pharmacy.lat,pharmacy.lon);
        pharmacy.distance = pharmacy.distance < 99 ? parseFloat(pharmacy.distance.toFixed(1)): Math.round(pharmacy.distance);
      }
      return pharmacy;
    });

    if (ubication) {
      pharmacies.sort((a, b) => a.distance - b.distance);
    }

    setArray(pharmacies);
    setLetra(pharmaciesData.dateShift.toUpperCase());
  }, [data, day, month, year, horaActual, ubication, lat1, lon1]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!data) {
    return <div></div>;
  }

  const formatDistance = (distance) => {
    if (distance < 1) return `${Math.round(distance * 1000)} Mt.`;
    return `${distance} Km.`;
  };

    return (
        <div className="containerFarmacias">
            <h2>Datos de Farmacias</h2>
            <p>
                Letra: <span style={{color: "green", fontWeight: "bold"}}>{letra}</span>
                
            </p>
            <button className="btn-show-map" onClick={() => setMostrarMapa(!mostrarMapa)} title="Mostrar/Ocultar mapa">
                {mostrarMapa ? 
                <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#EA3323"><path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z"/></svg>
                : 
                <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#008000"><path d="m608-120-255.33-90-181.34 71.33q-18 8.67-34.66-2.16Q120-151.67 120-172v-558.67q0-13 7.5-23t19.83-15L352.67-840 608-750.67 788.67-822q18-8 34.66 2.5Q840-809 840-788.67v563.34q0 11.66-7.5 20.33-7.5 8.67-19.17 13L608-120Zm-36-82.67v-492.66L388-758v492.67l184 62.66Zm66.67 0 134.66-44.66v-499.34l-134.66 51.34v492.66Zm-452-11.33 134.66-51.33V-758l-134.66 44.67V-214Zm452-481.33v492.66-492.66ZM321.33-758v492.67V-758Z"/></svg>
                }
              </button>
            
            {array && !mostrarMapa ? (
                array.map((pharmacy, index) => (
                    <div className="items" key={index}>
                        <div className="infoItems">
                            <p>{pharmacy.name}</p>
                            <p>{pharmacy.address}</p>
                            {ubication && <p>{formatDistance(pharmacy.distance)}</p>}
                            <p>{pharmacy.tel}</p>
                        </div>
                        <div className="btn-container">
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.lat},${pharmacy.lon}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Ver en mapa"
                            >
                                <img src={iconoPosicion}/>
                            </a>
                        </div>
                    </div>
                ))
            ) : ''}

            {!array && (
                <p>No se encontraron farmacias para mostrar.</p>
            )}

            {array && mostrarMapa && (
                <div style={{height: 400, width: "100%"}}>
                    <MapaUbicaciones puntos={array} actual={{
                        lat: lat1,
                        lng: lon1
                    }}/>
                </div>
            )}

        </div>
    );
};

export default Peticiones;
