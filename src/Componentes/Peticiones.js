import React, { useState, useEffect } from "react";
import axios from "axios";
import "./peticiones.css";

const Peticiones = ({hora,day,month,year,setLoader,ubication,lat1,lon1}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [array, setArray] = useState([]);
  const [letra, setLetra] = useState("");

  const url = "https://farmacia-servidor.vercel.app/api/farmacias";

  // Convierte la hora en texto de string a una hora real
  const convertToTime = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return new Date(2024, 0, 1, hours, minutes, seconds).getTime();
  };

  const horaActual = convertToTime(hora);
  const inicio = convertToTime("00:00:00");
  const fin = convertToTime("08:30:00");

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
        Letra: <span style={{ color: "green", fontWeight: "bold" }}>{letra}</span>
      </p>
      {array.length > 0 ? (
        array.map((pharmacy, index) => (
          <div className="items" key={index}>
            <div className="infoItems">
              <p>{pharmacy.name}</p>
              <p>{pharmacy.address}</p>
              { ubication && <p>{formatDistance(pharmacy.distance)}</p> }
              <p>{pharmacy.tel}</p>
            </div>
            <div className="btn-container">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.lat},${pharmacy.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Ver en mapa"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="40px"
                  viewBox="0 -960 960 960"
                  width="40px"
                  fill="#EA3323"
                >
                  <path d="M480.06-486.67q30.27 0 51.77-21.56 21.5-21.55 21.5-51.83 0-30.27-21.56-51.77-21.55-21.5-51.83-21.5-30.27 0-51.77 21.56-21.5 21.55-21.5 51.83 0 30.27 21.56 51.77 21.55 21.5 51.83 21.5ZM480-80Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z" />
                </svg>
              </a>
            </div>
          </div>
        ))
      ) : (
        <p>No se encontraron farmacias para mostrar.</p>
      )}
    </div>
  );
};

export default Peticiones;
