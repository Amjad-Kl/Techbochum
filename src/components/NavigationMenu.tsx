
import React, { useState } from 'react';
import { Home, Search, Navigation, User, Heart } from 'lucide-react';

const NavigationMenu = () => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', icon: Home, label: 'Startseite' },
    { id: 'search', icon: Search, label: 'Suchen' },
    { id: 'navigation', icon: Navigation, label: 'Navigation' },
    { id: 'favorites', icon: Heart, label: 'Favoriten' },
    { id: 'profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-4 min-w-0 flex-1 transition-colors focus:outline-none focus:ring-2 focus:ring-accessible-blue rounded-lg ${
                isActive 
                  ? 'text-accessible-blue' 
                  : 'text-accessible-gray hover:text-accessible-blue'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationMenu;
