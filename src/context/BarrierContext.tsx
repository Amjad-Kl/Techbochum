
import { createContext, useState, useContext, ReactNode } from 'react';

type Barrier = {
  id: string;
  type: 'stairs' | 'narrow' | 'elevator';
  description: string;
  coordinates: [number, number];
};

type BarrierContextType = {
  barriers: Barrier[];
  addBarrier: (barrier: Omit<Barrier, 'id'>) => void;
};

const BarrierContext = createContext<BarrierContextType>({
  barriers: [],
  addBarrier: () => {},
});

export const BarrierProvider = ({ children }: { children: ReactNode }) => {
  const [barriers, setBarriers] = useState<Barrier[]>([
    {
      id: '1',
      type: 'stairs',
      description: '2 Stufen am Eingang',
      coordinates: [7.216, 51.483],
    }
  ]);

  const addBarrier = (barrier: Omit<Barrier, 'id'>) => {
    setBarriers(prev => [
      ...prev,
      {
        ...barrier,
        id: Math.random().toString(36).substring(2, 9),
      }
    ]);
  };

  return (
    <BarrierContext.Provider value={{ barriers, addBarrier }}>
      {children}
    </BarrierContext.Provider>
  );
};

export const useBarriers = () => useContext(BarrierContext);
