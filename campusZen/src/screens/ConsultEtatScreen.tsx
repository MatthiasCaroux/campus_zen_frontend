import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ressourcesStyles } from '../screenStyles/RessourcesStyle';
import React, { useEffect, useState } from 'react';
import { getRessources } from '../services/RessourceProvider';
import { getStoredUser, getStatuts, getClimatById, getRandomMessageByClimatId } from '../services/AuthService';
import { useNavigation } from '@react-navigation/native';

function getClimatImage(nom: string) {
  // map simple nom climat -> image
  switch (nom.toLowerCase()) {
    case 'nuageux':
      return require('../assets/nuageux.png');
    case 'ensoleillé':
      return require('../assets/soleil.png');
    case 'pluvieux':
      return require('../assets/pluvieux.png');
    case 'vent frais':
      return require('../assets/vent_frais.png');
    case 'tempête':
      return require('../assets/orageux.png');
    case 'quand le vent souffle':
      return require('../assets/venteux.png');
    default:
      return require('../assets/nuageux.png');
  }
}

const ConsultEtatScreen: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [filteredStatuts, setFilteredStatuts] = useState<any[]>([]);
  const [totalUserStatuts, setTotalUserStatuts] = useState<number>(0);
  const [climatNom, setClimatNom] = useState<string | null>(null);
  const [climatId, setClimatId] = useState<number | null>(null);
  const [randomMessage, setRandomMessage] = useState<string | null>(null);
  const [ressourcesClimat, setRessourcesClimat] = useState<any[]>([]);
  const [randomRessource, setRandomRessource] = useState<any | null>(null);

  // Charger les ressources associées au climat
  useEffect(() => {
    const fetchRessourcesClimat = async () => {
      if (climatId) {
        try {
          const ressourcesData = await getRessources();
          const filtered = ressourcesData.filter((r: any) => r.climat === climatId);
          setRessourcesClimat(filtered);
          if (filtered.length > 0) {
            const randomIndex = Math.floor(Math.random() * filtered.length);
            setRandomRessource(filtered[randomIndex]);
          } else {
            setRandomRessource(null);
          }
        } catch (err) {
          setRessourcesClimat([]);
          setRandomRessource(null);
        }
      } else {
        setRessourcesClimat([]);
        setRandomRessource(null);
      }
    };
    fetchRessourcesClimat();
  }, [climatId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getStoredUser();
        if (data) {
          setUser(data);
          if (data.idPers) {
            await fetchAndGetLastStatuts(data.idPers);
          }
        }
      } catch (error) {
        // Erreur silencieuse
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const fetchAndGetLastStatuts = async (userId: number) => {
    try {
      const statuts = await getStatuts();
      if (!Array.isArray(statuts)) {
        setFilteredStatuts([]);
        setClimatNom(null);
        return;
      }
      const filtered = statuts.filter((s) => s.personne === userId);
      setTotalUserStatuts(filtered.length);
      if (filtered.length > 0) {
        const lastStatut = filtered.reduce((latest, current) => {
          return new Date(current.dateStatut) > new Date(latest.dateStatut) ? current : latest;
        }, filtered[0]);
        setFilteredStatuts([lastStatut]);
        if (lastStatut.climat) {
          try {
            const climatData = await getClimatById(lastStatut.climat);
            setClimatNom(climatData.nomClimat);
            setClimatId(lastStatut.climat);
            const message = await getRandomMessageByClimatId(lastStatut.climat);
            setRandomMessage(message);
          } catch {
            setClimatNom(null);
            setClimatId(null);
            setRandomMessage(null);
          }
        } else {
          setClimatNom(null);
          setClimatId(null);
          setRandomMessage(null);
        }
      } else {
        setFilteredStatuts([]);
        setClimatNom(null);
      }
    } catch {
      setFilteredStatuts([]);
      setClimatNom(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={{ flex: 1, backgroundColor: '#5DB2F7' }}>
      <View style={styles.pageContainer}>
        {climatNom && (
          <>
            <Image
              source={getClimatImage(climatNom)}
              style={styles.climatImage}
              resizeMode="contain"
            />
            <Text style={styles.encouragementText}>
              {randomMessage ? randomMessage : ""}
            </Text>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.buttonWrapper} onPress={() => {
                navigation.navigate("Maps");
              }}>
                <Text style={styles.buttonText}>Consulter la carte des professionnels</Text>
              </Pressable>
              
              {totalUserStatuts >= 2 ? (
                <Pressable style={styles.buttonWrapper} onPress={() => {
                  navigation.navigate("Evolution");
                }}>
                  <Text style={styles.buttonText}>Voir mes progrès</Text>
                </Pressable>
              ) : (
                <View style={[styles.buttonWrapper, styles.buttonDisabled]}>
                  <Text style={styles.buttonTextDisabled}>Voir mes progrès</Text>
                  <Text style={styles.buttonHint}>Complétez au moins 2 questionnaires</Text>
                </View>
              )}
            </View>

            {randomRessource && (
              <View style={{marginTop: 24, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 8, textAlign: 'center'}}>Ressource associée :</Text>
                <View style={[ressourcesStyles.card, {alignSelf: 'center', width: '90%'}]}>
                  <View style={[ressourcesStyles.headerRow, {justifyContent: 'center'}]}>
                    <Ionicons
                      name={
                        randomRessource.typeR === 'article' ? 'document-text-outline'
                        : randomRessource.typeR === 'video' ? 'play-circle-outline'
                        : randomRessource.typeR === 'podcast' ? 'mic-outline'
                        : randomRessource.typeR === 'livre' ? 'book-outline'
                        : randomRessource.typeR === 'site_web' ? 'globe-outline'
                        : randomRessource.typeR === 'documentaire' ? 'film-outline'
                        : randomRessource.typeR === 'film' ? 'videocam-outline'
                        : randomRessource.typeR === 'formation' ? 'school-outline'
                        : 'cube-outline'
                      }
                      size={28}
                      color="#3366FF"
                    />
                    <Text style={ressourcesStyles.type}>{randomRessource.typeR.toUpperCase()}</Text>
                  </View>
                  <Text style={ressourcesStyles.title}>{randomRessource.titreR}</Text>
                  <Text style={ressourcesStyles.description}>{randomRessource.descriptionR}</Text>
                  <TouchableOpacity onPress={() => Linking.openURL(randomRessource.lienR)}>
                    <Text style={ressourcesStyles.link}>Voir la ressource →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5DB2F7',
    padding: 24,
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5DB2F7',
    padding: 24,
  },
  climatImage: {
    width: 160,
    height: 160,
    marginTop: 32,
    marginBottom: 32,
    alignSelf: 'center',
  },
  encouragementText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 28,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonWrapper: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: