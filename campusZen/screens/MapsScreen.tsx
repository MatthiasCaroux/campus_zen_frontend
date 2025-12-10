import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions, Animated, PanResponder, Platform } from 'react-native';
import { MapView, Marker } from '../components/Map';
import { Region } from 'react-native-maps';
import Professionnel from '../types/Professionnel';
import { useProfessionnels } from '../hooks/useProfessionnels';
import { mapStyles } from '../src/screenStyles/MapsStyle';
import { useNavigation } from '@react-navigation/native';
import { getStoredUser } from '../services/AuthService';
import * as Location from 'expo-location';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const COLLAPSED_PERCENT = 0.40; 
const EXPANDED_PERCENT = 0.85;  
const DEFAULT_REGION: Region = {
    latitude: -0.4814965375088253, // Centre par défaut
    longitude: 15.89751099904558, // Owando, République du Congo
    latitudeDelta: 0.5, 
    longitudeDelta: 0.5,
  }

export default function MapsScreen() {
  const { professionnels, loading } = useProfessionnels();
  const navigation = useNavigation();

  const [selectedPro, setSelectedPro] = useState<number | null>(null);
  const [visiblePros, setVisiblePros] = useState<Professionnel[]>([]);
  const [nonVisiblePros, setNonVisiblePros] = useState<Professionnel[]>([]);

  const [currentRegion, setCurrentRegion] = useState<Region>(DEFAULT_REGION);
  
  const mapRef = useRef<any>(null);

  const sheetHeightCollapsed = SCREEN_HEIGHT * COLLAPSED_PERCENT;
  const sheetHeightExpanded = SCREEN_HEIGHT * EXPANDED_PERCENT;
  const minY = SCREEN_HEIGHT - sheetHeightCollapsed; 
  const maxY = SCREEN_HEIGHT - sheetHeightExpanded;

  const sheetY = useRef(new Animated.Value(minY)).current;
  
  const [user, setUser] = useState<any>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(true);

  const getUserLocation = async () => {
    try {
      // Demander la permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Permission de localisation refusée');
        setCurrentRegion(DEFAULT_REGION);
        setLocationLoading(false);
        return;
      }

      // Obtenir la position actuelle
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userRegion: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.5, 
        longitudeDelta: 0.5,
      };

      setCurrentRegion(userRegion);
      
      if (mapRef.current && mapRef.current.animateToRegion) {
        mapRef.current.animateToRegion(userRegion, 1000);
      }

    } catch (error) {
      console.error('Erreur lors de la récupération de la position:', error);
      setCurrentRegion(DEFAULT_REGION);
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    sheetY.setValue(minY);
    const fetchUser = async () => {
      const userData = await getStoredUser();
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    };
    getUserLocation();
    fetchUser();
  }, []);

    const lastY = useRef(minY);
  
    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 5,
        onPanResponderGrant: () => {
          // Enregistre la position actuelle au début du geste
          sheetY.stopAnimation((value) => {
            lastY.current = value;
          });
        },
        onPanResponderMove: (_, gesture) => {
          // Calcule la nouvelle position basée sur le delta du geste
          const newPos = lastY.current + gesture.dy;
          
          // Limite le déplacement entre maxY (haut) et minY (bas)
          // Ne peut pas descendre en dessous de la position minimale 
          if (newPos >= maxY && newPos <= minY) {
            sheetY.setValue(newPos);
          } else if (newPos < maxY) {
            // Bloque en haut
            sheetY.setValue(maxY);
          } else if (newPos > minY) {
            // Bloque en bas (50%)
            sheetY.setValue(minY);
          }
        },
        onPanResponderRelease: (_, gesture) => {
          // Calcule la position finale
          const finalY = lastY.current + gesture.dy;
          const midPoint = (maxY + minY) / 2;
          
          // Si on est au-dessus du milieu, on ouvre complètement
          // Sinon on revient à la position minimale 
          const shouldExpand = finalY < midPoint;
  
          Animated.spring(sheetY, {
            toValue: shouldExpand ? maxY : minY,
            useNativeDriver: false,
            tension: 50,
            friction: 8,
          }).start(() => {
            lastY.current = shouldExpand ? maxY : minY;
          });
        },
      })
    ).current;

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
 
  const handleViewDetails = (proId: number) => {
    navigation.navigate('ProDetailsScreen', { proId: proId });
  };

  /*
  const handleViewDetails = (pro: Professionnel) => {
    navigation.navigate('ProDetailsScreen', { professionnel: pro });
  };
  */

  useEffect(() => {
    filterProfessionnelsByRegion(currentRegion);
  }, [professionnels, currentRegion]);

  if (loading || locationLoading) {
    return (
      <View style={mapStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={mapStyles.loadingText}>
          {locationLoading ? 'Localisation en cours...' : 'Chargement des professionnels...'}
        </Text>
      </View>
    );
  }

  const orderedPros = [...visiblePros, ...nonVisiblePros];

  const renderProCard = (pro: Professionnel, isVisible: boolean) => (
    <View key={pro.idPro} style={mapStyles.proCardWrapper}>
      <TouchableOpacity
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
      
      {selectedPro === pro.idPro && (
        <TouchableOpacity
          style={mapStyles.detailsButton}
          onPress={() => handleViewDetails(pro.idPro)}
          // onPress={() => handleViewDetails(pro)}
        >
          <Text style={mapStyles.detailsButtonText}>Voir les détails</Text>
        </TouchableOpacity>
      )}
    </View>
  );

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

      <TouchableOpacity
        style={mapStyles.recenterButton}
        onPress={getUserLocation}
      >
        <Text style={mapStyles.recenterButtonText}>📍</Text>
      </TouchableOpacity>

      {/*
      <View style={mapStyles.floatingHeader}>
        <Text style={mapStyles.floatingTitle}>Professionnels dans la zone</Text>
        <Text style={mapStyles.floatingCount}>{visiblePros.length} visible(s)</Text>
      </View>
      */}
    </View>

    {Platform.OS !== "web" ? (
            <Animated.View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: sheetHeightExpanded,
                top: sheetY,
                backgroundColor: "#fff",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                overflow: "hidden",
                elevation: 20,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 8,
              }}
              {...panResponder.panHandlers}
            >
      <View style={mapStyles.dragHandleContainer}>
        <View style={mapStyles.dragHandle} />
      </View>
      
      <View style={mapStyles.listHeader}>
        <Text style={mapStyles.listTitle}>Liste des professionnels</Text>
        <Text style={mapStyles.listSubtitle}>Sélectionne un professionnel pour centrer la carte</Text>

        {user && user.role == "admin" && (
          <TouchableOpacity
            style={mapStyles.addButton}
            onPress={() => navigation.navigate('ProFormScreen')} // Remplace par le screen d'ajout pro
          >
            <Text style={mapStyles.addButtonText}>+ Ajouter</Text>
          </TouchableOpacity>
        )}
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
              {visiblePros.map((pro) => (renderProCard(pro, true)))}

              {nonVisiblePros.length > 0 && (
                <Text style={mapStyles.sectionTitle}>Hors de la zone :</Text>
              )}
              {nonVisiblePros.map((pro) => renderProCard(pro, false))}
            </>
          )}
        </ScrollView>
      </Animated.View>
    ) : (
      <View style={mapStyles.listContainer}>

      <View style={mapStyles.listHeader}>
        <Text style={mapStyles.listTitle}>Liste des professionnels</Text>
        <Text style={mapStyles.listSubtitle}>Sélectionne un professionnel pour centrer la carte</Text>

          {user && user.role == "admin" && (
          <TouchableOpacity
            style={mapStyles.addButton}
            onPress={() => navigation.navigate('RessourceFormScreen')} // Remplace par le screen d'ajout pro
          >
            <Text style={mapStyles.addButtonText}>+ Ajouter</Text>
          </TouchableOpacity>
        )}
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
              {visiblePros.map((pro) => renderProCard(pro, true))}

              {nonVisiblePros.length > 0 && (
                <Text style={mapStyles.sectionTitle}>Hors de la zone :</Text>
              )}
              {nonVisiblePros.map((pro) => renderProCard(pro, false))}
            </>
          )}
        </ScrollView>
      </View>
    )}

  </View>
  );
}


