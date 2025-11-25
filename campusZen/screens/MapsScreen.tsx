import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { MapView, Marker } from '../components/Map';
import { Region } from 'react-native-maps';
import Professionnel from '../types/Professionnel';
import { useProfessionnels } from '../hooks/useProfessionnels';
import { mapStyles } from '../src/screenStyles/MapsScreenStyle';

export default function MapsScreen() {
  const { professionnels, loading } = useProfessionnels();
  // let filteredPros = professionnels;


  const [selectedPro, setSelectedPro] = useState<number | null>(null);
  const [visiblePros, setVisiblePros] = useState<Professionnel[]>([]);
  const [nonVisiblePros, setNonVisiblePros] = useState<Professionnel[]>([]);

  const [currentRegion, setCurrentRegion] = useState<Region>({
    latitude: -0.4814965375088253, // Centre par défaut
    longitude: 15.89751099904558, // Owando, République du Congo
    latitudeDelta: 0.5, // TODO : Changer les valeurs en fonction de la position de l'utilisateur si val par défaut
    longitudeDelta: 0.5,
  });
  
  const mapRef = useRef<any>(null);

  // Filtrer les professionnels en fonction de la région visible
  const filterProfessionnelsByRegion = (region: Region) => {
    if (!professionnels || professionnels.length === 0) return;

    const visible = professionnels.filter((pro) => {
      if (!pro.lat || !pro.long) return false;

      const latDiff = Math.abs(pro.lat - region.latitude);
      const longDiff = Math.abs(pro.long - region.longitude);

      return latDiff <= region.latitudeDelta / 2 && longDiff <= region.longitudeDelta / 2;
    });

    const nonVisible = professionnels.filter((pro) => !visible.includes(pro));

    setVisiblePros(visible);
    setNonVisiblePros(nonVisible);
  };

  const handleRegionChange = (region: Region) => {
    console.log("Nouvelle région :", region);
    setCurrentRegion(region);
    filterProfessionnelsByRegion(region);
  };

  const handleMarkerPress = (proId: number) => {
    setSelectedPro(proId);
  };

  const handleProCardPress = (pro: Professionnel) => {
    setSelectedPro(pro.idPro);
    // Centrer la carte sur le professionnel
    if (pro.lat && pro.long && mapRef.current) {
      const newRegion = {
        latitude: pro.lat,
        longitude: pro.long,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      
      // Pour react-native-maps (mobile)
      if (mapRef.current.animateToRegion) {
        mapRef.current.animateToRegion(newRegion, 500);
      }
      // TODO
      // Il faudra peut être implémenter une fonction flyTo dans le composant Map pour le web
    }
  };

  useEffect(() => {
    filterProfessionnelsByRegion(currentRegion);
  }, [professionnels]);

  if (loading) {
    return (
      <View style={mapStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={mapStyles.loadingText}>Chargement des professionnels...</Text>
      </View>
    );
  }

  const orderedPros = [...visiblePros, ...nonVisiblePros];

  return (
  <View style={mapStyles.container}>

    <View style={mapStyles.mapContainer}>
      <MapView
        ref={mapRef}
        style={mapStyles.map}
        initialRegion={currentRegion}
        onRegionChangeComplete={handleRegionChange}
      >
        {professionnels.map((pro) => (
          pro.lat && pro.long && (
            <Marker
              key={pro.idPro}
              coordinate={{
                latitude: pro.lat,
                longitude: pro.long,
              }}
              title={`${pro.fonctionPro}`}
              description={pro.adressePro}
              onPress={() => handleMarkerPress(pro.idPro)}
            />
          )
        ))}
      </MapView>

      {/*
      <View style={mapStyles.floatingHeader}>
        <Text style={mapStyles.floatingTitle}>Professionnels dans la zone</Text>
        <Text style={mapStyles.floatingCount}>{visiblePros.length} visible(s)</Text>
      </View>
      */}
    </View>

    <View style={mapStyles.listContainer}>

      <View style={mapStyles.listHeader}>
        <Text style={mapStyles.listTitle}>Liste des professionnels</Text>
        <Text style={mapStyles.listSubtitle}>Sélectionne un professionnel pour centrer la carte</Text>
      </View>

      <ScrollView style={mapStyles.scrollView} contentContainerStyle={mapStyles.scrollContent}>
          {orderedPros.length === 0 ? (
            <View style={mapStyles.emptyContainer}>
              <Text style={mapStyles.emptyText}>Aucun professionnel trouvé</Text>
            </View>
          ) : (
            <>
              {visiblePros.length > 0 && (
                <Text style={mapStyles.sectionTitle}>Dans la zone visible :</Text>
              )}
              {visiblePros.map((pro) => (
                <TouchableOpacity
                  key={pro.idPro}
                  style={[
                    mapStyles.proCard,
                    selectedPro === pro.idPro && mapStyles.proCardSelected,
                  ]}
                  onPress={() => handleProCardPress(pro)}
                >
                  <View style={mapStyles.proHeader}>
                    <Text style={mapStyles.proFonction}>{pro.fonctionPro}</Text>
                  </View>
                  <Text style={mapStyles.proAddress}>{pro.adressePro}</Text>
                </TouchableOpacity>
              ))}

              {nonVisiblePros.length > 0 && (
                <Text style={mapStyles.sectionTitle}>Hors de la zone :</Text>
              )}
              {nonVisiblePros.map((pro) => (
                <TouchableOpacity
                  key={pro.idPro}
                  style={[
                    mapStyles.proCard,
                    selectedPro === pro.idPro && mapStyles.proCardSelected,
                  ]}
                  onPress={() => handleProCardPress(pro)}
                >
                  <View style={mapStyles.proHeader}>
                    <Text style={mapStyles.proFonction}>{pro.fonctionPro}</Text>
                  </View>
                  <Text style={mapStyles.proAddress}>{pro.adressePro}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      </View>

    </View>
  );
}


