
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import ReportModal from './ReportModal';

const ReportButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  const handleReport = () => {
    // GPS-Koordinaten abfragen oder Demo-Koordinaten verwenden
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates([position.coords.longitude, position.coords.latitude]);
          setIsOpen(true);
        },
        () => {
          // Fallback auf Demo-Koordinaten (Bochum)
          setCoordinates([7.216, 51.483]);
          setIsOpen(true);
        }
      );
    } else {
      // Fallback auf Demo-Koordinaten
      setCoordinates([7.216, 51.483]);
      setIsOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleReport}
        className="fixed bottom-24 right-6 bg-accessible-blue text-white p-4 rounded-full shadow-xl hover:bg-blue-700 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105"
        aria-label="Hindernis oder Barriere melden"
      >
        <PlusCircle className="w-8 h-8" />
      </button>
      
      <ReportModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        coordinates={coordinates}
      />
    </>
  );
};

export default ReportButton;
