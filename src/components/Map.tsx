import { useEffect, useRef } from 'react';
import { locations } from '../data/locations';
import L from 'leaflet';

const Map = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        // Initialize map
        const map = L.map(mapRef.current).setView([51.4816, 7.2162], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Add markers for locations
        locations.forEach(location => {
            L.marker([location.lat, location.lng])
                .addTo(map)
                .bindPopup(location.name);
        });

        return () => {
            map.remove();
        };
    }, []);

    return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
};

export default Map;