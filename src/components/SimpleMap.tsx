
import { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { useBarriers } from '@/context/BarrierContext';

const SimpleMap = () => {
  const mapRef = useRef(null);
  const { barriers } = useBarriers();

  useEffect(() => {
    Promise.all([
      import('ol/Map'),
      import('ol/View'),
      import('ol/layer/Tile'),
      import('ol/source/OSM'),
      import('ol/Overlay'),
      import('ol/Feature'),
      import('ol/geom/Point'),
      import('ol/layer/Vector'),
      import('ol/source/Vector'),
      import('ol/style/Style'),
      import('ol/style/Circle'),
      import('ol/style/Fill'),
      import('ol/style/Stroke'),
    ]).then(([Map, View, TileLayer, OSM, Overlay, Feature, Point, VectorLayer, VectorSource, Style, Circle, Fill, Stroke]) => {
      const map = new Map.default({
        target: mapRef.current,
        layers: [
          new TileLayer.default({
            source: new OSM.default()
          })
        ],
        view: new View.default({
          center: [7.216, 51.483].map(coord => coord * 100000),
          zoom: 13
        })
      });

      // Vektor-Layer für Barrieren
      const vectorSource = new VectorSource.default();
      const vectorLayer = new VectorLayer.default({
        source: vectorSource,
        style: new Style.default({
          image: new Circle.default({
            radius: 7,
            fill: new Fill.default({ color: '#EA4335' }),
            stroke: new Stroke.default({ color: '#fff', width: 2 })
          })
        })
      });
      map.addLayer(vectorLayer);

      // Barrieren hinzufügen
      barriers.forEach(barrier => {
        const marker = new Feature.default({
          geometry: new Point.default(
            barrier.coordinates.map(coord => coord * 100000)
          )
        });
        vectorSource.addFeature(marker);
      });

      // Popup für Barrieren-Details
      const popup = new Overlay.default({
        element: document.createElement('div'),
        positioning: 'bottom-center',
        offset: [0, -10]
      });
      map.addOverlay(popup);

      map.on('click', (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
        if (feature) {
          const barrier = barriers.find(b => 
            b.coordinates[0] === feature.getGeometry().getCoordinates()[0] / 100000 &&
            b.coordinates[1] === feature.getGeometry().getCoordinates()[1] / 100000
          );
          
          if (barrier) {
            popup.getElement().innerHTML = `
              <div class="bg-white p-3 rounded shadow-lg border border-gray-200 max-w-xs">
                <h3 class="font-bold text-red-600">Barriere</h3>
                <p>${barrier.description}</p>
                <p class="text-sm text-gray-500 mt-1">${barrier.type === 'stairs' ? 'Treppen/Stufen' : 
                  barrier.type === 'narrow' ? 'Enger Durchgang' : 'Aufzug defekt'}</p>
              </div>
            `;
            popup.setPosition(evt.coordinate);
          }
        }
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [barriers]);

  return <div ref={mapRef} className="h-full w-full" />;
};

export default SimpleMap;
