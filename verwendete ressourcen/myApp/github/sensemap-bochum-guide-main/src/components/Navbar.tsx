
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, User as UserIcon, Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MapPin className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-xl font-bold text-primary">SenseMap</h1>
        </div>
        
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300" 
              placeholder="Suche nach Orten in Bochum..." 
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <UserIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
