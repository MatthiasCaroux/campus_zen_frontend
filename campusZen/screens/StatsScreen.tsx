import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, Image } from 'react-native';
import { testApiConnection } from '../config/axiosConfig';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width - 130;

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99],
    },
  ],
};


const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};  

export default function StatsScreen() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      const result = await testApiConnection();
      if (result.success) {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
        setErrorMessage(result.error || 'Erreur inconnue');
      }
    };

    checkConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistiques</Text>
      <Text style={styles.subtitle}>Suivez vos performances</Text>

      <View>
        <BarChart
          data={data}
          width={screenWidth - 16}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          yAxisLabel="Mois"
          yAxisSuffix="Jours"
        />
      </View>

      <View style={styles.apiStatusContainer}>
        {apiStatus === 'loading' && (
          <>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.statusText}>Vérification de la connexion à l'API...</Text>
          </>
        )}

        {apiStatus === 'connected' && (
          <>
            <Text style={styles.statusIcon}>✅</Text>
            <Text style={[styles.statusText, styles.connected]}>
              Connexion à l'API établie
            </Text>
          </>
        )}

        {apiStatus === 'error' && (
          <>
            <Text style={styles.statusIcon}>❌</Text>
            <Text style={[styles.statusText, styles.error]}>
              Échec de connexion à l'API
            </Text>
            <Text style={styles.errorDetails}>{errorMessage}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 30,
  },
  apiStatusContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  connected: {
    color: '#34C759',
  },
  error: {
    color: '#FF3B30',
  },
  errorDetails: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
});