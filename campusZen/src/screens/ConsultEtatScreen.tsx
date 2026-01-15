import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getStoredUser, getStatuts, getClimatById, getRandomMessageByClimatId } from '../services/AuthService';

function getClimatImage(nom: string) {
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
  const [loading, setLoading] = useState(true);
  const [filteredStatuts, setFilteredStatuts] = useState<any[]>([]);
  const [climatNom, setClimatNom] = useState<string | null>(null);
  const [climatId, setClimatId] = useState<number | null>(null);
  const [randomMessage, setRandomMessage] = useState<string | null>(null);

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
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonText}>Consulter la carte des professionnels</Text>
            </View>
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonText}>Voir mes progrès</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5DB2F7',
  },
  loadingText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
});

export default ConsultEtatScreen;