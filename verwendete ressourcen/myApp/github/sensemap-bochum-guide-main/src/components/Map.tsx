
import React, { useState } from 'react';
import { Obstacle, Place } from '@/types';

// Mock data for demonstration
const mockObstacles: Obstacle[] = [
  {
    id: '1',
    userId: 'user1',
    type: 'staircase',
    location: { lat: 51.4815, lng: 7.2194 },
    description: 'Steile Treppe ohne Handlauf',
    status: 'confirmed',
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: 'user2',
    type: 'broken_elevator',
    location: { lat: 51.4833, lng: 7.2167 },
    description: 'Aufzug außer Betrieb',
    status: 'unconfirmed',
    createdAt: new Date(),
  }
];

const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Jahrhunderthalle Bochum',
    location: { lat: 51.4833, lng: 7.2167 },
    accessibility: {
      wheelchair: true,
      blind: false,
      elderly: true,
      stroller: true,
      ratings: [
        { userId: 'user123', stars: 4, comment: 'Rampen vorhanden, aber schmale Türen.', createdAt: new Date() }
      ]
    },
    averageRating: 4,
    address: 'An der Jahrhunderthalle 1, 44793 Bochum'
  }
];

const Map: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<'obstacle' | 'place' | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // This would use the Google Maps or Leaflet API in a real app
  return (
    <div className="sensemap-map bg-gray-100 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Interaktive Karte (wird geladen...)</p>
          <div className="flex justify-center space-x-4 mb-6">
            {mockObstacles.map(obstacle => (
              <div 
                key={obstacle.id}
                className="p-3 rounded-full bg-destructive shadow-md cursor-pointer"
                onClick={() => {
                  setSelectedItem('obstacle');
                  setSelectedId(obstacle.id);
                }}
              >
                <span className="sr-only">{obstacle.type}</span>
              </div>
            ))}
            {mockPlaces.map(place => (
              <div 
                key={place.id}
                className="p-3 rounded-full bg-secondary shadow-md cursor-pointer"
                onClick={() => {
                  setSelectedItem('place');
                  setSelectedId(place.id);
                }}
              >
                <span className="sr-only">{place.name}</span>
              </div>
            ))}
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-destructive rounded-full mr-2"></div>
              <span className="text-sm">Hindernis</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-secondary rounded-full mr-2"></div>
              <span className="text-sm">Barrierefreier Ort</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating action button */}
      <button 
        className="absolute bottom-6 right-6 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Hindernis melden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default Map;
