
import React from 'react';
import { X, Accessibility, Eye, Ear, Brain } from 'lucide-react';

interface AccessibilityPanelProps {
  onClose: () => void;
}

const AccessibilityPanel = ({ onClose }: AccessibilityPanelProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full max-h-96 rounded-t-xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-accessible-gray">Barrierefreiheits-Einstellungen</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accessible-blue"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <h3 className="font-medium text-accessible-gray">Mobilitätshilfen</h3>
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Accessibility className="w-5 h-5 text-accessible-blue" />
                <span>Rollstuhlgerechte Routen</span>
              </div>
              <input type="checkbox" className="w-5 h-5 text-accessible-blue" />
            </label>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-accessible-gray">Sehbehinderungen</h3>
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-accessible-blue" />
                <span>Hoher Kontrast</span>
              </div>
              <input type="checkbox" className="w-5 h-5 text-accessible-blue" />
            </label>
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-accessible-blue" />
                <span>Große Schrift</span>
              </div>
              <input type="checkbox" className="w-5 h-5 text-accessible-blue" />
            </label>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-accessible-gray">Hörbehinderungen</h3>
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Ear className="w-5 h-5 text-accessible-blue" />
                <span>Visuelle Benachrichtigungen</span>
              </div>
              <input type="checkbox" className="w-5 h-5 text-accessible-blue" />
            </label>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-accessible-gray">Kognitive Unterstützung</h3>
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-accessible-blue" />
                <span>Einfache Sprache</span>
              </div>
              <input type="checkbox" className="w-5 h-5 text-accessible-blue" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPanel;
