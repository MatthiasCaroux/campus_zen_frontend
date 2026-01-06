import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as colors from "../src/theme/colors.js";
import apiClient from "../config/axiosConfig";

type Questionnaire = {
  idQuestionnaire: number;
  nomQuestionnaire: string;
  descriptionQuestionnaire: string;
};

import { useNavigation } from '@react-navigation/native';

export default function QuestionnaireScreen() {
  const navigation = useNavigation<any>();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/questionnaires/');
      const data = response.data?.data ?? response.data ?? [];
      setQuestionnaires(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionnaireItem = ({ item }: { item: Questionnaire }) => (
    <TouchableOpacity
      style={styles.questionnaireCard}
      onPress={() => navigation.navigate('Questions', { idQuestionnaire: item.idQuestionnaire })}
    >
      <Text style={styles.questionnaireName}>{item.nomQuestionnaire}</Text>
      <Text style={styles.questionnaireDescription}>{item.descriptionQuestionnaire}</Text>
      <Text style={styles.answerPrompt}>Appuyez pour répondre →</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.COULEUR_HEADER_BLEU} />
        <Text style={styles.loadingText}>Chargement des questionnaires...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchQuestionnaires}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Questionnaires disponibles</Text>
      <FlatList
        data={questionnaires}
        renderItem={renderQuestionnaireItem}
        keyExtractor={(item) => item.idQuestionnaire.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucun questionnaire disponible</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.COULEUR_FOND_BLEU_CLAIR,
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.COULEUR_FOND_BLEU_CLAIR,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.COULEUR_TEXT_DARK,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  questionnaireCard: {
    backgroundColor: colors.COULEUR_WHITE,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: colors.COULEUR_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionnaireName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.COULEUR_TEXT_DARK,
    marginBottom: 8,
  },
  questionnaireDescription: {
    fontSize: 14,
    color: colors.COULEUR_TEXT_DARK,
    opacity: 0.7,
    marginBottom: 8,
  },
  answerPrompt: {
    fontSize: 14,
    color: colors.COULEUR_HEADER_BLEU,
    fontWeight: '600',
    marginTop: 8,
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
  retryButton: {
    backgroundColor: colors.COULEUR_HEADER_BLEU,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: colors.COULEUR_WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: colors.COULEUR_TEXT_DARK,
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.6,
  },
});
