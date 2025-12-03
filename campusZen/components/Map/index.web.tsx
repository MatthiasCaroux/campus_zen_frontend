import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Importez le CSS sans les images locales
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet - utilise un CDN au lieu des images locales
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface Region extends Coordinate {
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapViewProps {
  style?: any;
  initialRegion?: Region;
  children?: React.ReactNode;
  onRegionChangeComplete?: (region: Region) => void;
}

interface MarkerProps {
  coordinate: Coordinate;
  title?: string;
  description?: string;
  onPress?: () => void;
}

const MapEventHandler: React.FC<{ onRegionChange?: (region: Region) => void }> = ({ onRegionChange }) => {
  const map = useMapEvents({
    moveend: () => {
      if (onRegionChange) {
        const center = map.getCenter();
        const bounds = map.getBounds();
        const latDelta = bounds.getNorth() - bounds.getSouth();
        const lngDelta = bounds.getEast() - bounds.getWest();
        
        console.log('Map moveend - Nouvelle région:', {
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        });
        
        onRegionChange({
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        });
      }
    },
    zoomend: () => {
      if (onRegionChange) {
        const center = map.getCenter();
        const bounds = map.getBounds();
        const latDelta = bounds.getNorth() - bounds.getSouth();
        const lngDelta = bounds.getEast() - bounds.getWest();
        
        console.log('Map zoomend - Nouvelle région:', {
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        });
        
        onRegionChange({
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        });
      }
    },
  });
  return null;
};

export const MapView: React.FC<MapViewProps> = ({ style, initialRegion, children, onRegionChangeComplete }) => {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  const center: [number, number] = initialRegion 
    ? [initialRegion.latitude, initialRegion.longitude]
    : [48.8566, 2.3522]; // Paris par défaut

  // Calculer le niveau de zoom à partir de latitudeDelta
  const zoom = initialRegion 
    ? Math.round(Math.log2(360 / initialRegion.latitudeDelta))
    : 13;

  return (
    <div style={style}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapEventHandler onRegionChange={onRegionChangeComplete} />
        {children}
      </MapContainer>
    </div>
  );
};

export const Marker: React.FC<MarkerProps> = ({ coordinate, title, description, onPress }) => {
  return (
    <LeafletMarker 
      position={[coordinate.latitude, coordinate.longitude]}
      eventHandlers={{
        click: onPress,
      }}
    >
      {(title || description) && (
        <Popup>
          {title && <strong>{title}</strong>}
          {description && <div>{description}</div>}
        </Popup>
      )}
    </LeafletMarker>
  );
};

export default MapView;