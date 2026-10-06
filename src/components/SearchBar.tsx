
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent focus-within:border-accessible-blue transition-colors">
        <Search className="w-5 h-5 text-accessible-gray ml-3" />
        <input
          type="text"
          placeholder="Ort, Adresse oder Ziel suchen..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 p-3 bg-transparent outline-none text-base"
          aria-label="Ort suchen"
        />
        <button 
          className="p-3 text-accessible-blue hover:bg-blue-50 transition-colors"
          aria-label="Aktueller Standort"
        >
          <MapPin className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
