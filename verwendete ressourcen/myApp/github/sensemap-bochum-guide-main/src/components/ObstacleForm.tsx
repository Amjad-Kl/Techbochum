
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ObstacleType } from '@/types';

const obstacleTypes: { value: ObstacleType; label: string }[] = [
  { value: 'staircase', label: 'Treppe / Stufen' },
  { value: 'narrow_passage', label: 'Enger Durchgang' },
  { value: 'broken_elevator', label: 'Defekter Aufzug' },
  { value: 'high_curb', label: 'Hoher Bordstein' },
  { value: 'steep_ramp', label: 'Steile Rampe' },
  { value: 'no_tactile_paving', label: 'Keine taktile Pflasterung' },
  { value: 'other', label: 'Sonstiges' }
];

const ObstacleForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would process the form data
    console.log('Form submitted');
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Hindernis melden</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="obstacle-photo">Foto hinzufügen</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Klicken zum Hochladen oder Bild ziehen</p>
              <Input id="obstacle-photo" type="file" className="hidden" accept="image/*" />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Art des Hindernisses</Label>
            <RadioGroup defaultValue="staircase">
              <div className="grid grid-cols-2 gap-2">
                {obstacleTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label htmlFor={type.value}>{type.label}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea id="description" placeholder="Beschreiben Sie das Hindernis genauer..." className="min-h-[100px]" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="location">Standort</Label>
            <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Karte zum Standort auswählen</p>
            </div>
          </div>

          <Button type="submit" className="w-full">Hindernis melden</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ObstacleForm;
