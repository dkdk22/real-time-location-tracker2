import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

interface Location {
  id: string;
  lat: number;
  lng: number;
}

const customIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function App() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('locationUpdate', (data: Location) => {
      setLocations(prevLocations => {
        const index = prevLocations.findIndex(loc => loc.id === data.id);
        if (index !== -1) {
          const newLocations = [...prevLocations];
          newLocations[index] = data;
          return newLocations;
        } else {
          return [...prevLocations, data];
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Real-time Location Tracker</h1>
      </header>
      <main className="p-4">
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '70vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((location) => (
            <Marker key={location.id} position={[location.lat, location.lng]} icon={customIcon}>
              <Popup>
                ID: {location.id}<br />
                Lat: {location.lat.toFixed(4)}<br />
                Lng: {location.lng.toFixed(4)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>
    </div>
  );
}

export default App;