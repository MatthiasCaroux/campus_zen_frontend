import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';

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

let markersData: MarkerProps[] = [];

export const MapView = React.forwardRef<any, MapViewProps>(({ style, initialRegion, children, onRegionChangeComplete }, ref) => {
  const webViewRef = useRef<WebView>(null);

  // Extraire les markers des children
  useEffect(() => {
    if (children) {
      const markers: MarkerProps[] = [];
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === Marker) {
          markers.push(child.props);
        }
      });
      markersData = markers;

      // Envoyer les markers à la WebView
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          updateMarkers(${JSON.stringify(markers)});
          true;
        `);
      }
    }
  }, [children]);

  // Exposer des méthodes via ref
  React.useImperativeHandle(ref, () => ({
    animateToRegion: (region: Region, duration?: number) => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          if (window.map) {
            window.map.flyTo([${region.latitude}, ${region.longitude}], ${Math.round(Math.log2(360 / region.latitudeDelta))}, {
              duration: ${(duration || 1000) / 1000}
            });
          }
          true;
        `);
      }
    },
  }));

  const center = initialRegion
    ? [initialRegion.latitude, initialRegion.longitude]
    : [48.8566, 2.3522];

  const zoom = initialRegion
    ? Math.round(Math.log2(360 / initialRegion.latitudeDelta))
    : 13;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body, html { margin: 0; padding: 0; height: 100%; width: 100%; }
        #map { height: 100%; width: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        let markers = [];

        // Initialiser la carte
        const map = L.map('map', {
          zoomControl: true,
          attributionControl: true,
        }).setView([${center[0]}, ${center[1]}], ${zoom});

        // Exposer la carte globalement
        window.map = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Fonction pour mettre à jour les markers
        window.updateMarkers = function(newMarkers) {
          // Supprimer les anciens markers
          markers.forEach(marker => marker.remove());
          markers = [];

          // Ajouter les nouveaux markers
          if (newMarkers && Array.isArray(newMarkers)) {
            newMarkers.forEach(markerData => {
              const marker = L.marker([markerData.coordinate.latitude, markerData.coordinate.longitude])
                .addTo(map);

              if (markerData.title || markerData.description) {
                let popupContent = '';
                if (markerData.title) popupContent += '<strong>' + markerData.title + '</strong>';
                if (markerData.description) popupContent += '<div>' + markerData.description + '</div>';
                marker.bindPopup(popupContent);
              }

              markers.push(marker);
            });
          }
        };

        // Envoyer les changements de région à React Native
        function sendRegionChange() {
          const center = map.getCenter();
          const bounds = map.getBounds();
          const latDelta = bounds.getNorth() - bounds.getSouth();
          const lngDelta = bounds.getEast() - bounds.getWest();

          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'regionChange',
            region: {
              latitude: center.lat,
              longitude: center.lng,
              latitudeDelta: latDelta,
              longitudeDelta: lngDelta,
            }
          }));
        }

        map.on('moveend', sendRegionChange);
        map.on('zoomend', sendRegionChange);

        // Initialiser avec les markers
        setTimeout(() => {
          updateMarkers(${JSON.stringify(markersData)});
        }, 100);
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'regionChange' && onRegionChangeComplete) {
        onRegionChangeComplete(data.region);
      }
    } catch (e) {
      console.error('Error parsing WebView message:', e);
    }
  };

  return (
    <View style={style}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadEnd={true}
        scalesPageToFit={true}
        mixedContentMode="always"
      />
    </View>
  );
});

export const Marker: React.FC<MarkerProps> = () => {
  // Ce composant est juste un placeholder pour les children
  return null;
};

export default MapView;
