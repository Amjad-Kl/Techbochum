import { useState } from 'react';
import { locations } from '../data/locations';

const LocationDetails = ({ locationId }) => {
    const location = locations.find(loc => loc.id === locationId);

    if (!location) {
        return <div>Standort nicht gefunden</div>;
    }

    return (
        <div className="location-details">
            <h2>{location.name}</h2>
            <p>{location.description}</p>
            <div className="images">
                {location.images.map((img, index) => (
                    <img key={index} src={img} alt={`Standort ${location.name}`} />
                ))}
            </div>
            <h3>Hindernisse</h3>
            <ul>
                {location.obstacles.map((obstacle, index) => (
                    <li key={index}>{obstacle}</li>
                ))}
            </ul>
        </div>
    );
};

export default LocationDetails;