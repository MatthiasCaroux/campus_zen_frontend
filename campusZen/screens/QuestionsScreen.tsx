import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import * as colors from "../src/theme/colors.js";
import apiClient from '../config/axiosConfig.js';

type Question = {
    idQuestion: number;
    intituleQuestion: string;
    poids: number;
    questionnaireId: number;
};

type Response = {
    idReponse: number;
    texte: string;
    score: number;
    question: number;
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
    const [availableResponses, setAvailableResponses] = useState<Response[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingResponses, setLoadingResponses] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchQuestions();
    }, [idQuestionnaire]);

    useEffect(() => {
        if (currentQuestion) {
            fetchResponses(currentQuestion.idQuestion);
        }
    }, [currentQuestionIndex, questions]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/questions/?questionnaireId=${idQuestionnaire}`);
            setQuestions(response.data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchResponses = async (questionId: number) => {
        try {
            setLoadingResponses(true);
            const response = await apiClient.get(`/reponses/?question=${questionId}`);
            // S'assurer que response.data est un tableau
            const data = Array.isArray(response.data) ? response.data : [];
            setAvailableResponses(data);
        } catch (err) {
            console.error('Erreur lors de la récupération des réponses:', err);
            setAvailableResponses([]);
        } finally {
            setLoadingResponses(false);
        }
    };



    const currentQuestion = questions[currentQuestionIndex];
    const currentResponse = responses[currentQuestion?.idQuestion];

    const handleResponseSelect = (responseId: number) => {
        if (currentQuestion) {
            setResponses({ ...responses, [currentQuestion.idQuestion]: responseId });
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

            {/* Échelle de réponses */}
            <View style={styles.likertContainer}>
                {loadingResponses ? (
                    <ActivityIndicator size="large" color={colors.COULEUR_HEADER_BLEU} />
                ) : Array.isArray(availableResponses) && availableResponses.length > 0 ? (
                    availableResponses.map((response) => (
                        <TouchableOpacity
                            key={response.idReponse}
                            style={[
                                styles.responseOption,
                                currentResponse === response.idReponse && styles.responseOptionSelected,
                            ]}
                            onPress={() => handleResponseSelect(response.idReponse)}
                        >
                            <Text
                                style={[
                                    styles.responseText,
                                    currentResponse === response.idReponse && styles.responseTextSelected,
                                ]}
                            >
                                {response.texte}
                            </Text>
                            {currentResponse === response.idReponse && (
                                <View style={styles.checkmark}>
                                    <Text style={styles.checkmarkText}>✓</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Aucune réponse disponible pour cette question</Text>
                )}
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
    responseOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.COULEUR_WHITE,
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        shadowColor: colors.COULEUR_BLACK,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    responseOptionSelected: {
        borderColor: colors.COULEUR_HEADER_BLEU,
        backgroundColor: '#F0F7FF',
        borderWidth: 2,
    },
    responseText: {
        flex: 1,
        fontSize: 16,
        color: colors.COULEUR_TEXT_DARK,
        lineHeight: 22,
    },
    responseTextSelected: {
        fontWeight: '600',
        color: colors.COULEUR_HEADER_BLEU,
    },
    checkmark: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.COULEUR_HEADER_BLEU,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    checkmarkText: {
        color: colors.COULEUR_WHITE,
        fontSize: 18,
        fontWeight: 'bold',
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