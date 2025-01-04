import React, {useEffect, useRef} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import logo from '../img/iconoCruzFarmaciaVerde.png'
import iconoPosicion from '../img/iconoPosicion.svg'

// -33.34701293557163, -60.221357974152944

const MapaUbicaciones = ({puntos, actual}) => {

  if (actual && (actual.lat === null && actual.lng === null)) {
    actual.lat = -33.34701293557163;
    actual.lng = -60.221357974152944;
  }
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !mapRef.current) {
      // Inicializar el mapa
      mapRef.current = L.map(containerRef.current).setView([0, 0], 2);

      // Añadir capa de mosaicos
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    if (mapRef.current) {
      // Limpiar marcadores anteriores
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current.removeLayer(layer);
        }
      });

      // Agregar marcadores
      puntos.forEach((punto) => {
        L.marker(
          [punto.lat, punto.lon],
          {
            icon: L.icon({
              iconSize: [38, 38],
              iconAnchor: [19, 19],
              iconUrl: logo,
            }),
          })
          .addTo(mapRef.current)
          .bindPopup(`${punto.name}<br>${punto.address}<br>${punto.tel}`);
      });

      if (actual) {
        // Agregar marcadores
        L.marker(
          [actual.lat, actual.lng],
          {
            icon: L.icon({
              iconSize: [38, 38],
              iconAnchor: [19, 19],
              iconUrl: iconoPosicion,
            }),
          })
          .addTo(mapRef.current);
      }

      // Ajustar vista
      if (puntos.length > 0) {
        const localBounds = puntos.map((punto) => [punto.lat, punto.lon]);
        if (actual) {
          localBounds.push([actual.lat, actual.lng]);
        }
        const bounds = L.latLngBounds(localBounds);
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [puntos]);

  return <div ref={containerRef} style={{height: 400, width: "100%"}}/>;
};

export default MapaUbicaciones;
