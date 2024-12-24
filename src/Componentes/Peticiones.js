import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import "./peticiones.css";
import MapaUbicaciones from "./MapaUbicaciones";
import iconoPosicion from '../img/iconoPosicion.svg'

const Peticiones = ({hora, day, month, year, setLoader, ubication, lat1, lon1}) => {
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
                <button onClick={() => setMostrarMapa(!mostrarMapa)}>
                    {mostrarMapa ? 'Ocultar mapa' : 'Mostrar mapa'}
                </button>
            </p>
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
