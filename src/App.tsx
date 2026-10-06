import { useState } from 'react';
import Map from './components/Map';
import LocationDetails from './components/LocationDetails';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  return (
    <div className="app">
      <Navbar />
      <div className="content">
        <Map onLocationSelect={setSelectedLocation} />
        {selectedLocation && (
          <LocationDetails locationId={selectedLocation} />
        )}
      </div>
    </div>
  );
}

export default App;