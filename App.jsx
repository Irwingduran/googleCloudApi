import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { usePlacesAutocomplete, getGeocode, getLatLng   
 } from 'use-places-autocomplete';

const libraries = ['places'];
const mapContainerStyle   
 = {
  width: '100%',
  height: '400px',
};

function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({});

  const {
    suggestions: { data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => location.lat, lng: () => location.lng },
      radius: 2000,   

    },
  });

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setLocation({   
 lat, lng });

    // Ahora que tienes las coordenadas, puedes usar la Places API para obtener más detalles
    // ...
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            handleSelect(address);
          }
        }}
      />
      <div>Sugerencias: {data.map((suggestion) => <div key={suggestion.place_id}>{suggestion.description}</div>)}</div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={location}
        zoom={15}
      >
        {/* Marcadores, etc. */}
      </GoogleMap>
    </div>
  );
}

export default App;
