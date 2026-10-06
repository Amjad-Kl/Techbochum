import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Map from '../components/Map';
import ObstacleForm from '../components/ObstacleForm';
import LocationDetails from '../components/LocationDetails';
import ProfileView from '../components/ProfileView';
import { Place } from '@/types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
const Index = () => {
  // Mock data for demonstration
  const mockPlace: Place = {
    id: '1',
    name: 'Jahrhunderthalle Bochum',
    location: {
      lat: 51.4833,
      lng: 7.2167
    },
    accessibility: {
      wheelchair: true,
      blind: false,
      elderly: true,
      stroller: true,
      ratings: [{
        userId: 'user123',
        stars: 4,
        comment: 'Rampen vorhanden, aber schmale Türen.',
        createdAt: new Date()
      }]
    },
    averageRating: 4,
    address: 'An der Jahrhunderthalle 1, 44793 Bochum'
  };
  type View = 'map' | 'obstacle-form' | 'location-details' | 'profile';
  const [currentView, setCurrentView] = useState<View>('map');
  const renderView = () => {
    switch (currentView) {
      case 'obstacle-form':
        return <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Hindernis melden</h2>
              <Button variant="ghost" size="icon" onClick={() => setCurrentView('map')}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ObstacleForm />
          </div>;
      case 'location-details':
        return <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ortsdetails</h2>
              <Button variant="ghost" size="icon" onClick={() => setCurrentView('map')}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <LocationDetails place={mockPlace} />
          </div>;
      case 'profile':
        return <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Mein Profil</h2>
              <Button variant="ghost" size="icon" onClick={() => setCurrentView('map')}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ProfileView />
          </div>;
      case 'map':
      default:
        return <>
            <Map />
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <Button onClick={() => setCurrentView('obstacle-form')} variant="default" className="shadow-md">
                Hindernis melden
              </Button>
              <Button onClick={() => setCurrentView('location-details')} variant="outline" className="bg-white shadow-md">
                Details anzeigen
              </Button>
            </div>
          </>;
    }
  };
  return <div className="sensemap-container">
      <Navbar />
      <div className="relative flex-grow bg-slate-50">
        {renderView()}
      </div>
      
      {/* Bottom Navigation */}
      <div className="flex justify-around p-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <Button variant={currentView === 'map' ? 'default' : 'ghost'} className="flex flex-col items-center" onClick={() => setCurrentView('map')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="text-xs mt-1">Karte</span>
        </Button>
        <Button variant={currentView === 'obstacle-form' ? 'default' : 'ghost'} className="flex flex-col items-center" onClick={() => setCurrentView('obstacle-form')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs mt-1">Melden</span>
        </Button>
        <Button variant={currentView === 'profile' ? 'default' : 'ghost'} className="flex flex-col items-center" onClick={() => setCurrentView('profile')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">Profil</span>
        </Button>
      </div>
    </div>;
};
export default Index;