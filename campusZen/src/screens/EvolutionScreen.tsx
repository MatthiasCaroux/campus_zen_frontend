import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getStoredUser, getStatuts, getClimatById } from '../services/AuthService';
import { StatutWithClimat, getClimatScore, CLIMAT_SCORES } from '../types/Statut';

const screenWidth = Dimensions.get('window').width;

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

const EvolutionScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [statuts, setStatuts] = useState<StatutWithClimat[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvolutionData();
  }, []);

  const fetchEvolutionData = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await getStoredUser();
      if (!user || !user.idPers) {
        setError('Utilisateur non connecté');
        setLoading(false);
        return;
      }

      const allStatuts = await getStatuts();
      if (!Array.isArray(allStatuts)) {
        setError('Impossible de récupérer les statuts');
        setLoading(false);
        return;
      }

      // Filtrer par utilisateur
      const userStatuts = allStatuts.filter((s: any) => s.personne === user.idPers);

      // Trier par date (du plus ancien au plus récent)
      userStatuts.sort((a: any, b: any) => 
        new Date(a.dateStatut).getTime() - new Date(b.dateStatut).getTime()
      );

      // Garder seulement les 10 derniers
      const last10Statuts = userStatuts.slice(-10);

      // Enrichir avec les données climat
      const enrichedStatuts: StatutWithClimat[] = await Promise.all(
        last10Statuts.map(async (statut: any) => {
          try {
            const climatData = await getClimatById(statut.climat);
            const climatNom = climatData?.nomClimat || 'inconnu';
            return {
              ...statut,
              climatNom,
              climatScore: getClimatScore(climatNom),
            };
          } catch {
            return {
              ...statut,
              climatNom: 'inconnu',
              climatScore: 50,
            };
          }
        })
      );

      setStatuts(enrichedStatuts);
    } catch (err) {
      console.error('Erreur lors de la récupération des données d\'évolution:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // date labels removed for mobile

  // Message d'évolution retiré : affichage simplifié pour mobile

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Chargement de votre évolution...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const chartData = {
    // remove date labels for a cleaner mobile view
    labels: statuts.map(() => ''),
    datasets: [
      {
        data: statuts.map((s) => s.climatScore),
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#5DB2F7',
    backgroundGradientTo: '#4A90E2',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#fff',
    },
    decimalPlaces: 0,
  };

  // calculate responsive chart width to avoid overflow on small phones
  const chartWidth = Math.max(280, Math.min(screenWidth - 40, 600));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Mon Évolution</Text>
      <Text style={styles.subtitle}>Suivez l'évolution de votre bien-être</Text>

      {/* Graphique d'évolution */}
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={160}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          yAxisSuffix=""
          yAxisInterval={1}
          withHorizontalLabels={false}
          withVerticalLines={false}
          fromZero
          segments={4}
          withInnerLines={false}
        />
      </View>

      {/* Historique détaillé */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Historique (10 derniers)</Text>
        {[...statuts].reverse().map((statut, index) => (
          <View key={statut.idStatut || index} style={styles.historyItem}>
            <Image source={getClimatImage(statut.climatNom)} style={styles.historyImage} resizeMode="contain" />
            <View style={styles.historyInfo}>
              <Text style={styles.historyClimat}>{statut.climatNom}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5DB2F7',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5DB2F7',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5DB2F7',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#f7fbff',
    textAlign: 'center',
    marginBottom: 14,
    opacity: 0.95,
  },
  chartContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 12,
  },
  legendWrap: {
    marginBottom: 10,
  },
  legendScroll: {
    paddingLeft: 6,
    paddingRight: 6,
    alignItems: 'center',
  },
  legendCompactItem: {
    alignItems: 'center',
    width: 72,
    marginRight: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  legendImageSmall: {
    width: 26,
    height: 26,
    marginBottom: 4,
  },
  legendTextSmall: {
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
  },
  historyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyImage: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  historyClimat: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  historyScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
});

export default EvolutionScreen;
