
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { stairs, Accessibility, Move } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const ReportModal = ({ open, onClose, coordinates }) => {
  const [barrier, setBarrier] = useState({
    type: '',
    description: '',
    coordinates: coordinates || null
  });

  useEffect(() => {
    if (coordinates) {
      setBarrier(prev => ({ ...prev, coordinates }));
    }
  }, [coordinates]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Gemeldete Barriere:', barrier);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Barriere melden</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block font-medium">Position</label>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Move className="h-4 w-4" />
              {coordinates ? 
                `${coordinates[0].toFixed(5)}, ${coordinates[1].toFixed(5)}` : 
                'Position wird ermittelt...'}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Art der Barriere</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={barrier.type === 'stairs' ? 'default' : 'outline'}
                onClick={() => setBarrier({...barrier, type: 'stairs'})}
              >
                <stairs className="mr-2 h-4 w-4" />
                Treppen/Stufen
              </Button>
              <Button
                type="button"
                variant={barrier.type === 'narrow' ? 'default' : 'outline'}
                onClick={() => setBarrier({...barrier, type: 'narrow'})}
              >
                <Accessibility className="mr-2 h-4 w-4" />
                Enger Durchgang
              </Button>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Beschreibung</label>
            <Textarea
              value={barrier.description}
              onChange={(e) => setBarrier({...barrier, description: e.target.value})}
              rows={3}
              placeholder="z.B. '3 Stufen ohne Handlauf'"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Barriere melden
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
