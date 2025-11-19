import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getCurrentUser } from '../services/AuthService';
import { getProfessionnels } from '../services/ProfessionnelProvider';
import { COULEUR_FOND_BLEU } from '../src/theme/colors';
import MapView from 'react-native-maps';

export default function MapsScreen() {

    const user = getCurrentUser();
    const [professionnels, setProfessionnels] = useState<any>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchProfessionnels = async () => {
        try {
          const data = await getProfessionnels();
          if (data) {
            setProfessionnels(data);
          }
        } catch (error) {
          console.error("Erreur récupération utilisateur", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfessionnels();
    }, []);

    if (professionnels === null) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Chargement des professionnels...</Text>
        </View>
      );
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maps de Pro</Text>
      {professionnels.map((pro: any) => (
        <View key={pro.idPers}>
          <Text>{pro.nomPro} {pro.prenomPro} - {pro.adressePro}</Text>
        </View>
      ))}
    </View>

    /*
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
    */
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COULEUR_FOND_BLEU,
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

