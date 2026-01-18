import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as colors from "../theme/colors.js";
import { apiClient } from '../services/apiClient';
import { getStoredUser } from '../services/AuthService';

// typages

type Question = {
    idQuestion: number;
    intituleQuestion: string;
    poids: number;
    questionnaireId: number;
};

type ResponseOption = {
    idReponse: number;
    texte: string;
    score: number;
    question: number;
};

export type UserAnswer = {
    idQuestion: number;
    idReponse: number;
};

// typage simple pour la route
type RootStackParamList = {
    Questions: { idQuestionnaire: number };
};

type QuestionsScreenRouteProp = RouteProp<RootStackParamList, 'Questions'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>;

// composant principal

export default function QuestionsScreen() {
    // ecran qui affiche les questions une par une puis envoie les reponses
    const route = useRoute<QuestionsScreenRouteProp>();
    const navigation = useNavigation<NavigationProps>();
    const { idQuestionnaire } = route.params;

    // etat principal
    const [questions, setQuestions] = useState<Question[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [availableResponses, setAvailableResponses] = useState<ResponseOption[]>([]);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

    const [loading, setLoading] = useState(true);
    const [loadingResponses, setLoadingResponses] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // etat pour afficher l ecran de succes
    const [isSuccess, setIsSuccess] = useState(false);

    const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

    const currentSelectedResponseId = useMemo(() => {
        return userAnswers.find(answer => answer.idQuestion === currentQuestion?.idQuestion)?.idReponse;
    }, [userAnswers, currentQuestion]);

    // fonctions api

    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            // questions filtrees par id questionnaire
            const data = await apiClient.get(`/questions/?questionnaireId=${idQuestionnaire}`);
            setQuestions(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            const errorMessage = (err as any)?.message || 'Erreur lors du chargement des questions.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [idQuestionnaire]);

    const fetchResponses = useCallback(async (questionId: number) => {
        try {
            setLoadingResponses(true);
            const result = await apiClient.get(`/reponses/?question=${questionId}`);
            const data: ResponseOption[] = Array.isArray(result) ? result : [];
            // tri par score pour avoir un ordre stable
            data.sort((a, b) => a.score - b.score);
            setAvailableResponses(data);
        } catch {
            setAvailableResponses([]);
        } finally {
            setLoadingResponses(false);
        }
    }, []);

    // effets

    useEffect(() => {
        const initializeUser = async () => {
            try {
                // on recupere l id user pour l envoi final
                const userData = await getStoredUser();
                if (userData && typeof userData === 'object' && 'idPers' in userData) {
                    setUserId(userData.idPers);
                } else if (typeof userData === 'number' || typeof userData === 'string') {
                    setUserId(Number(userData));
                }
            } catch (e) {
                console.error("Erreur user:", e);
            }
        };
        initializeUser();
    }, []);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    useEffect(() => {
        if (currentQuestion?.idQuestion) {
            fetchResponses(currentQuestion.idQuestion);
        }
    }, [currentQuestion?.idQuestion, fetchResponses]);

    // actions

    const handleResponseSelect = (responseId: number) => {
        if (!currentQuestion) return;
        setUserAnswers(prevAnswers => {
            const existingAnswerIndex = prevAnswers.findIndex(a => a.idQuestion === currentQuestion.idQuestion);
            const newAnswer = { idQuestion: currentQuestion.idQuestion, idReponse: responseId };
            if (existingAnswerIndex > -1) {
                const updated = [...prevAnswers];
                updated[existingAnswerIndex] = newAnswer;
                return updated;
            }
            return [...prevAnswers, newAnswer];
        });
    };

    const handleNext = () => {
        if (!currentSelectedResponseId) {
             Alert.alert("Oups", "Veuillez sélectionner une réponse.");
             return;
        }
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        if (!userId) {
             Alert.alert("Erreur", "Utilisateur non identifié.");
             return;
        }

        try {
            setIsSubmitting(true);
            // payload attendu par l api
            const submissionPayload = { idPers: userId, reponses: userAnswers };
            const endpoint = `/questionnaire/${idQuestionnaire}/submit`;
            
            console.log("Envoi...", submissionPayload);
            await apiClient.post(endpoint, submissionPayload);
            console.log("Réponse: Succès");

            // si pas d exception c est ok
            setIsSuccess(true);

        } catch (error: any) {
            console.error(error);
            Alert.alert('Erreur', "L'envoi a échoué. Vérifiez votre connexion.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // rendu

    // ecran de chargement
    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.COULEUR_HEADER_BLEU} />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    }

    // ecran de succes
    if (isSuccess) {
        return (
            <View style={[styles.centerContainer, { paddingHorizontal: 40 }]}>
                <View style={styles.successIconContainer}>
                    <Text style={{ fontSize: 50 }}>🎉</Text>
                </View>
                
                <Text style={styles.successTitle}>Merci !</Text>
                
                <Text style={styles.successMessage}>
                    Vos réponses ont bien été enregistrées.
                </Text>
                
                <Text style={styles.successSubMessage}>
                    Vous pouvez consulter l'évolution de votre état directement depuis la page d'accueil.
                </Text>

                <TouchableOpacity 
                    style={styles.retryButton} 
                    onPress={() => {
                        navigation.goBack();
                        navigation.goBack();
                        navigation.navigate('ConsultEtat');
                    }} // retour puis navigation vers consult etat
                >
                    <Text style={styles.retryButtonText}>Consulter mon état</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // gestion des erreurs de chargement
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

    // cas vide
    if (!currentQuestion) return null;

    // ecran du questionnaire
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>Question {currentQuestionIndex + 1} / {questions.length}</Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }]} />
                </View>
            </View>

            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{currentQuestion.intituleQuestion}</Text>
            </View>

            <View style={styles.likertContainer}>
                {loadingResponses ? (
                    <ActivityIndicator color={colors.COULEUR_HEADER_BLEU} />
                ) : (
                    availableResponses.map((response) => (
                        <TouchableOpacity
                            key={response.idReponse}
                            style={[
                                styles.responseOption,
                                currentSelectedResponseId === response.idReponse && styles.responseOptionSelected,
                            ]}
                            onPress={() => handleResponseSelect(response.idReponse)}
                            disabled={isSubmitting}
                        >
                            <Text style={[
                                styles.responseText,
                                currentSelectedResponseId === response.idReponse && styles.responseTextSelected,
                            ]}>
                                {response.texte}
                            </Text>
                            {currentSelectedResponseId === response.idReponse && (
                                <View style={styles.checkmark}><Text style={styles.checkmarkText}>✓</Text></View>
                            )}
                        </TouchableOpacity>
                    ))
                )}
            </View>

            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
                    onPress={handlePrevious}
                    disabled={currentQuestionIndex === 0 || isSubmitting}
                >
                    <Text style={styles.navButtonText}>Précédent</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navButton, styles.nextButton, !currentSelectedResponseId && styles.navButtonDisabled]}
                    onPress={handleNext}
                    disabled={!currentSelectedResponseId || isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Text style={[styles.navButtonText, styles.nextButtonText]}>
                            {isLastQuestion ? 'Terminer' : 'Suivant'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.COULEUR_FOND_BLEU_CLAIR },
    scrollContent: { padding: 20, paddingBottom: 40, flexGrow: 1 }, // flex grow aide au centrage si peu de contenu
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.COULEUR_FOND_BLEU_CLAIR, padding: 20 },
    
    // styles pour l ecran de succes
    successIconContainer: { marginBottom: 20, backgroundColor: '#FFF', padding: 20, borderRadius: 50, elevation: 5 },
    successTitle: { fontSize: 28, fontWeight: 'bold', color: colors.COULEUR_HEADER_BLEU, marginBottom: 10 },
    successMessage: { fontSize: 18, color: colors.COULEUR_TEXT_DARK, textAlign: 'center', marginBottom: 10, fontWeight: '600' },
    successSubMessage: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30, lineHeight: 20 },

    progressContainer: { marginBottom: 30 },
    progressText: { fontSize: 16, color: colors.COULEUR_TEXT_DARK, marginBottom: 10, textAlign: 'center', fontWeight: '600' },
    progressBar: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: colors.COULEUR_HEADER_BLEU, borderRadius: 4 },
    questionContainer: { backgroundColor: colors.COULEUR_WHITE, borderRadius: 16, padding: 24, marginBottom: 30, shadowColor: colors.COULEUR_BLACK, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
    questionText: { fontSize: 20, fontWeight: 'bold', color: colors.COULEUR_TEXT_DARK, lineHeight: 28, textAlign: 'center' },
    likertContainer: { marginBottom: 30 },
    responseOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.COULEUR_WHITE, borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 2, borderColor: '#E8E8E8', shadowColor: colors.COULEUR_BLACK, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
    responseOptionSelected: { borderColor: colors.COULEUR_HEADER_BLEU, backgroundColor: '#F0F7FF', borderWidth: 2 },
    responseText: { flex: 1, fontSize: 16, color: colors.COULEUR_TEXT_DARK, lineHeight: 22 },
    responseTextSelected: { fontWeight: '600', color: colors.COULEUR_HEADER_BLEU },
    checkmark: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.COULEUR_HEADER_BLEU, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
    checkmarkText: { color: colors.COULEUR_WHITE, fontSize: 18, fontWeight: 'bold' },
    navigationContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    navButton: { flex: 1, backgroundColor: '#E0E0E0', borderRadius: 12, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
    nextButton: { backgroundColor: colors.COULEUR_HEADER_BLEU },
    navButtonDisabled: { opacity: 0.5 },
    navButtonText: { fontSize: 16, fontWeight: '600', color: colors.COULEUR_TEXT_DARK },
    nextButtonText: { color: colors.COULEUR_WHITE },
    loadingText: { marginTop: 10, fontSize: 16, color: colors.COULEUR_TEXT_DARK },
    errorText: { fontSize: 16, color: '#D32F2F', textAlign: 'center', marginBottom: 20 },
    retryButton: { backgroundColor: colors.COULEUR_HEADER_BLEU, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
    retryButtonText: { color: colors.COULEUR_WHITE, fontSize: 16, fontWeight: '600' },
});