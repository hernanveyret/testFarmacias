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
            {
              modoNocturno ? 
              <button className="btn-show-map" onClick={() => setMostrarMapa(!mostrarMapa)} title="Mostrar/Ocultar mapa">
                {mostrarMapa ? 
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg> : 
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#008000"><path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z"/></svg>
                }
              </button>
                :
              <button className="btn-show-map" onClick={() => setMostrarMapa(!mostrarMapa)} title="Mostrar/Ocultar mapa">
                {mostrarMapa ? 
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                : 
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#008000"><path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z"/></svg>
                }
              </button>
            }
            
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
