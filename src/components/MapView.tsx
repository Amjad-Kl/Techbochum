
import { useEffect, useState } from 'react';
import SimpleMap from './SimpleMap';

const MapView = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
        <p>Karte wird geladen...</p>
      </div>
    );
  }

  return <SimpleMap />;
};

export default MapView;
