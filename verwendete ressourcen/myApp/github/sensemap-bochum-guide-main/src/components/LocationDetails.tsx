
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Place } from '@/types';
import { Star, Check, X, Calendar } from 'lucide-react';

interface LocationDetailsProps {
  place: Place;
}

const LocationDetails: React.FC<LocationDetailsProps> = ({ place }) => {
  // Format date to display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{place.name}</CardTitle>
        <CardDescription>{place.address}</CardDescription>
        <div className="flex items-center mt-2">
          <div className="flex items-center mr-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${
                  i < Math.floor(place.averageRating || 0)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <Badge variant="outline">{place.averageRating || 0}/5</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-background mb-2">
              <span role="img" aria-label="wheelchair" className="text-lg">♿</span>
            </div>
            <p className="text-sm font-medium">Rollstuhl</p>
            {place.accessibility.wheelchair ? (
              <Check className="text-secondary h-5 w-5 mt-1" />
            ) : (
              <X className="text-destructive h-5 w-5 mt-1" />
            )}
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-background mb-2">
              <span role="img" aria-label="blind" className="text-lg">👁️</span>
            </div>
            <p className="text-sm font-medium">Sehbehindert</p>
            {place.accessibility.blind ? (
              <Check className="text-secondary h-5 w-5 mt-1" />
            ) : (
              <X className="text-destructive h-5 w-5 mt-1" />
            )}
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-background mb-2">
              <span role="img" aria-label="elderly" className="text-lg">👴</span>
            </div>
            <p className="text-sm font-medium">Senioren</p>
            {place.accessibility.elderly ? (
              <Check className="text-secondary h-5 w-5 mt-1" />
            ) : (
              <X className="text-destructive h-5 w-5 mt-1" />
            )}
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-background mb-2">
              <span role="img" aria-label="stroller" className="text-lg">👶</span>
            </div>
            <p className="text-sm font-medium">Kinderwagen</p>
            {place.accessibility.stroller ? (
              <Check className="text-secondary h-5 w-5 mt-1" />
            ) : (
              <X className="text-destructive h-5 w-5 mt-1" />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Bewertungen</h3>
          
          {place.accessibility.ratings.map((rating, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${rating.userId}`} alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">User-{rating.userId.substring(0, 4)}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${
                            i < rating.stars
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formatDate(rating.createdAt)}</span>
                </div>
              </div>
              <p className="text-sm mt-2">{rating.comment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationDetails;
