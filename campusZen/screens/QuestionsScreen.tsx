import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import * as colors from "../src/theme/colors.js";

type Question = {
  idQuestion: number;
  intituleQuestion: string;
  poids: number;
  questionnaireId: number;
};

type RootStackParamList = {
  Questions: { idQuestionnaire: number };
};

type QuestionsScreenRouteProp = RouteProp<RootStackParamList, 'Questions'>;

export default function QuestionsScreen() {
  const route = useRoute<QuestionsScreenRouteProp>();
  const navigation = useNavigation();
  const { idQuestionnaire } = route.params;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [idQuestionnaire]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://campuszenbackend-prod.up.railway.app/api/questionnaire/${idQuestionnaire}/questions`
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des questions');
      }

      const data = await response.json();
      setQuestions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const likertScale = [
    { value: 1, label: 'Pas du tout d\'accord', color: '#D32F2F' }, // Rouge foncé
    { value: 2, label: 'Pas d\'accord', color: '#F44336' }, // Rouge
    { value: 3, label: 'Plutôt pas d\'accord', color: '#FF9800' }, // Orange
    { value: 4, label: 'Neutre', color: '#FFC107' }, // Jaune
    { value: 5, label: 'Plutôt d\'accord', color: '#8BC34A' }, // Vert clair
    { value: 6, label: 'D\'accord', color: '#4CAF50' }, // Vert
    { value: 7, label: 'Tout à fait d\'accord', color: '#2E7D32' }, // Vert foncé
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = responses[currentQuestion?.idQuestion];

  const handleResponseSelect = (value: number) => {
    if (currentQuestion) {
      setResponses({ ...responses, [currentQuestion.idQuestion]: value });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Toutes les questions sont répondues
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Ici, vous pouvez envoyer les réponses à votre API
    console.log('Réponses:', responses);

    // TODO: Envoyer les réponses au backend
    // try {
    //   const response = await fetch('URL_DE_VOTRE_API/reponses', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ questionnaireId: idQuestionnaire, responses })
    //   });
    // } catch (error) {
    //   console.error('Erreur lors de l\'envoi des réponses:', error);
    // }

    // Naviguer vers l'écran de confirmation
    navigation.navigate('QuestionnaireCompleted' as never);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.COULEUR_HEADER_BLEU} />
        <Text style={styles.loadingText}>Chargement des questions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchQuestions}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Aucune question disponible</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Indicateur de progression */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} sur {questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.intituleQuestion}</Text>
      </View>

      {/* Échelle de Likert */}
      <View style={styles.likertContainer}>
        {likertScale.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.likertOption,
              currentResponse === option.value && styles.likertOptionSelected,
            ]}
            onPress={() => handleResponseSelect(option.value)}
          >
            <View style={[styles.likertCircle, { backgroundColor: option.color }]} />
            <Text
              style={[
                styles.likertLabel,
                currentResponse === option.value && styles.likertLabelSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Boutons de navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navButtonText}>Précédent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton, !currentResponse && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={!currentResponse}
        >
          <Text style={[styles.navButtonText, styles.nextButtonText]}>
            {currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.COULEUR_FOND_BLEU_CLAIR,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.COULEUR_FOND_BLEU_CLAIR,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressText: {
    fontSize: 16,
    color: colors.COULEUR_TEXT_DARK,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.COULEUR_HEADER_BLEU,
    borderRadius: 4,
  },
  questionContainer: {
    backgroundColor: colors.COULEUR_WHITE,
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    shadowColor: colors.COULEUR_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.COULEUR_TEXT_DARK,
    lineHeight: 28,
    textAlign: 'center',
  },
  likertContainer: {
    marginBottom: 30,
  },
  likertOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.COULEUR_WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: colors.COULEUR_BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  likertOptionSelected: {
    borderColor: colors.COULEUR_HEADER_BLEU,
    backgroundColor: '#E3F2FD',
  },
  likertCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 16,
    borderWidth: 2,
    borderColor: colors.COULEUR_WHITE,
    shadowColor: colors.COULEUR_BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  likertLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.COULEUR_TEXT_DARK,
  },
  likertLabelSelected: {
    fontWeight: '600',
    color: colors.COULEUR_HEADER_BLEU,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: colors.COULEUR_HEADER_BLEU,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.COULEUR_TEXT_DARK,
  },
  nextButtonText: {
    color: colors.COULEUR_WHITE,
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
