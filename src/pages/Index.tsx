
import React, { useState } from 'react';
import MapView from '@/components/MapView';
import SearchBar from '@/components/SearchBar';
import ReportButton from '@/components/ReportButton';
import NavigationMenu from '@/components/NavigationMenu';
import AccessibilityPanel from '@/components/AccessibilityPanel';

const Index = () => {
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-50">
      {/* Header with search */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white shadow-lg">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-accessible-blue">BarriereFrei</h1>
            <button 
              onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
              className="p-2 rounded-lg bg-accessible-blue text-white hover:bg-blue-700 transition-colors"
              aria-label="Barrierefreiheits-Einstellungen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </button>
          </div>
          <SearchBar />
        </div>
      </div>

      {/* Main map area */}
      <div className="pt-24 pb-20 h-full">
        <MapView />
      </div>

      {/* Bottom navigation */}
      <NavigationMenu />

      {/* Floating report button */}
      <ReportButton />

      {/* Accessibility settings panel */}
      {showAccessibilityPanel && (
        <AccessibilityPanel onClose={() => setShowAccessibilityPanel(false)} />
      )}
    </div>
  );
};

export default Index;
