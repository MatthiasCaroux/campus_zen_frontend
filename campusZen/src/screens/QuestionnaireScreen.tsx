import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as colors from "../theme/colors.js";
import { apiClient } from "../services/apiClient";
import { useNavigation } from '@react-navigation/native';

type Questionnaire = {
  idQuestionnaire: number;
  nomQuestionnaire: string;
  descriptionQuestionnaire: string;
};

export default function QuestionnaireScreen() {
  // ecran qui sélectionne un questionnaire au hasard et le lance
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAndLaunchRandomQuestionnaire();
  }, []);

  const fetchAndLaunchRandomQuestionnaire = async () => {
    try {
      setLoading(true);
      // appel direct sur la route questionnaires
      const data = await apiClient.get('/questionnaires/');
      const questionnaires = Array.isArray(data) ? data : [];
      
      if (questionnaires.length === 0) {
        setError('Aucun questionnaire disponible');
        return;
      }

      // Sélectionner un questionnaire au hasard
      const randomIndex = Math.floor(Math.random() * questionnaires.length);
      const selectedQuestionnaire = questionnaires[randomIndex];

      // Naviguer directement vers le questionnaire sélectionné
      navigation.navigate('Questions', { 
        idQuestionnaire: selectedQuestionnaire.idQuestionnaire 
      });
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.COULEUR_HEADER_BLEU} />
        <Text style={styles.loadingText}>Sélection d'un questionnaire...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.COULEUR_FOND_BLEU_CLAIR,
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.COULEUR_TEXT_DARK,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
});
