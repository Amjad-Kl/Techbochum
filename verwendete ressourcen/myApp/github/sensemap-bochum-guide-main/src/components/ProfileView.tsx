
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';

// Mock data for demonstration
const mockUser: User = {
  id: 'user123',
  name: 'Max Mustermann',
  email: 'max.mustermann@example.com',
  profilePicture: 'https://i.pravatar.cc/150?u=user123',
  contributions: {
    obstacles: 12,
    ratings: 8,
  }
};

const ProfileView: React.FC = () => {
  const { name, profilePicture, contributions } = mockUser;

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="flex flex-col items-center pb-0">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={profilePicture} alt={name} />
          <AvatarFallback>
            {name.split(' ').map(part => part[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-center">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div>
          <h3 className="font-semibold text-md mb-2">Deine Abzeichen</h3>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-xs py-0.5">
              Erkunder 🗺️
            </Badge>
            <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30 text-xs py-0.5">
              Bewerter ⭐
            </Badge>
            <Badge className="bg-amber-500/20 text-amber-700 hover:bg-amber-500/30 text-xs py-0.5">
              Helfer 🤝
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-md mb-2">Deine Beiträge</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">{contributions.obstacles}</p>
              <p className="text-sm text-gray-600">Gemeldete Hindernisse</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">{contributions.ratings}</p>
              <p className="text-sm text-gray-600">Abgegebene Bewertungen</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-md mb-2">Neueste Aktivität</h3>
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center text-sm">
                <span className="bg-destructive/20 text-destructive text-xs py-0.5 px-2 rounded-full mr-2">Hindernis</span>
                <p>Defekter Aufzug an der Hauptstraße gemeldet</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Vor 2 Tagen</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center text-sm">
                <span className="bg-secondary/20 text-secondary text-xs py-0.5 px-2 rounded-full mr-2">Bewertung</span>
                <p>Jahrhunderthalle Bochum bewertet</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Vor 1 Woche</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileView;
