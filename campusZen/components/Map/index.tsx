import React from 'react';
import RNMapView, { Marker as RNMarker, MapViewProps, MarkerProps } from 'react-native-maps';

export const MapView: React.FC<MapViewProps> = (props) => {
  return <RNMapView {...props} />;
};

export const Marker: React.FC<MarkerProps> = (props) => {
  return <RNMarker {...props} />;
};

export default MapView;