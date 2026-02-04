import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert, Animated, Dimensions } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as colors from "../theme/colors.js";
import { apiClient } from '../services/apiClient';
import { getStoredUser } from '../services/AuthService';

// --- Typages ---

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

type RootStackParamList = {
    Questions: { idQuestionnaire: number };
    ConsultEtat: {};
    HomeMain: {};
};

type QuestionsScreenRouteProp = RouteProp<RootStackParamList, 'Questions'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>;

// --- Composant Principal ---

export default function QuestionsScreen() {
    const route = useRoute<QuestionsScreenRouteProp>();
    const navigation = useNavigation<NavigationProps>();
    const { idQuestionnaire } = route.params;

    // État principal
    const [questions, setQuestions] = useState<Question[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [availableResponses, setAvailableResponses] = useState<ResponseOption[]>([]);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

    // États de statut
    const [loading, setLoading] = useState(true);
    const [loadingResponses, setLoadingResponses] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    // État pour la largeur du track (Slider)
    const [trackWidth, setTrackWidth] = useState(300);

    const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

    const currentSelectedResponseId = useMemo(() => {
        return userAnswers.find(answer => answer.idQuestion === currentQuestion?.idQuestion)?.idReponse;
    }, [userAnswers, currentQuestion]);

    // --- Fonctions API ---

    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiClient.get(`/questions/?questionnaireId=${idQuestionnaire}`);
            setQuestions(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            const e = err as any;
            const status = e?.response?.status;
            setError(`Erreur lors du chargement des questions (${status ?? 'réseau'})`);
        } finally {
            setLoading(false);
        }
    }, [idQuestionnaire]);

    const fetchResponses = useCallback(async (questionId: number) => {
        try {
            setLoadingResponses(true);
            const result = await apiClient.get(`/reponses/?question=${questionId}`);
            const data: ResponseOption[] = Array.isArray(result) ? result : [];
            data.sort((a, b) => a.score - b.score);
            setAvailableResponses(data);
        } catch {
            setAvailableResponses([]);
        } finally {
            setLoadingResponses(false);
        }
    }, []);

    // --- Effets ---

    useEffect(() => {
        setIsSuccess(false); // Reset au montage
        const initializeUser = async () => {
            try {
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
        fetchQuestions();
    }, [fetchQuestions]);

    useEffect(() => {
        if (currentQuestion?.idQuestion) {
            fetchResponses(currentQuestion.idQuestion);
        }
    }, [currentQuestion?.idQuestion, fetchResponses]);

    // --- Logique métier ---

    const getQuestionType = (q: any) => {
        const rawType = q?.type || q?.typeQuestion || q?.inputType || q?.modalite;
        if (typeof rawType === 'string') {
            const t = rawType.toLowerCase();
            if (['slider', 'smiley', 'multiple'].includes(t)) return t;
        }
        if (availableResponses.length > 0) {
            const texts = availableResponses.map(r => String(r.texte || '').trim());
            const emojiRx = /[\u{1F300}-\u{1F6FF}\u{1F600}-\u{1F64F}]/u;
            if (texts.some(t => emojiRx.test(t))) return 'smiley';
            if (texts.some(t => /\d+\s*%/.test(t))) return 'slider';
        }
        return 'single';
    };

    const getSelectedIdsForCurrent = () => {
        if (!currentQuestion) return [] as number[];
        return userAnswers.filter(a => a.idQuestion === currentQuestion.idQuestion).map(a => a.idReponse);
    };

    const handleResponseSelect = (responseId: number, mode: 'single' | 'multiple' = 'single') => {
        if (!currentQuestion) return;
        setUserAnswers(prevAnswers => {
            if (mode === 'multiple') {
                const existing = prevAnswers.filter(a => a.idQuestion === currentQuestion.idQuestion);
                const others = prevAnswers.filter(a => a.idQuestion !== currentQuestion.idQuestion);
                const exists = existing.some(a => a.idReponse === responseId);
                if (exists) {
                    return [...others, ...existing.filter(a => a.idReponse !== responseId)];
                } else {
                    return [...prevAnswers, { idQuestion: currentQuestion.idQuestion, idReponse: responseId }];
                }
            }
            const others = prevAnswers.filter(a => a.idQuestion !== currentQuestion.idQuestion);
            return [...others, { idQuestion: currentQuestion.idQuestion, idReponse: responseId }];
        });
    };

    const handleNext = () => {
        const selectedIds = getSelectedIdsForCurrent();
        if (selectedIds.length === 0 && !currentSelectedResponseId) {
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
        if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
    };

    const handleSubmit = async () => {
        if (isSubmitting || !userId) return;
        try {
            setIsSubmitting(true);
            const submissionPayload = { idPers: userId, reponses: userAnswers };
            const endpoint = `/questionnaire/${idQuestionnaire}/submit`;
            await apiClient.post(endpoint, submissionPayload);
            setIsSuccess(true);
        } catch (error: any) {
            const body = error?.response?.data;
            const bodyStr = JSON.stringify(body || "");
            if (bodyStr.includes('climat')) {
                setIsSuccess(true); // Succès fonctionnel même si erreur climat backend
            } else {
                Alert.alert('Erreur', "L'envoi a échoué. Vérifiez votre connexion.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Helpers de Rendu ---

    const getHslColor = (percent: number) => `hsl(${Math.round((percent / 100) * 120)}, 70%, 50%)`;

    const renderMouth = (mouthType: string, size: number = 26) => {
        const baseStyle = [styles.cssMouth, { width: size }];
        if (mouthType === 'veryHappy') return <View style={[...baseStyle, styles.cssMouthVeryHappy, { height: size * 0.5 }]} />;
        if (mouthType === 'happy') return <View style={[...baseStyle, styles.cssMouthHappy, { height: size * 0.4 }]} />;
        if (mouthType === 'neutral') return <View style={[...baseStyle, styles.cssMouthNeutral, { width: size * 0.6 }]} />;
        if (mouthType === 'sad') return <View style={[...baseStyle, styles.cssMouthSad, { height: size * 0.4 }]} />;
        return <View style={[...baseStyle, styles.cssMouthVerySad, { height: size * 0.5 }]} />;
    };

    const getMouthTypeFromPercent = (p: number) => {
        if (p <= 20) return 'verySad';
        if (p <= 40) return 'sad';
        if (p <= 60) return 'neutral';
        if (p <= 80) return 'happy';
        return 'veryHappy';
    };

    // --- Rendu Final ---

    if (loading) return (
        <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.COULEUR_HEADER_BLEU} />
            <Text style={styles.loadingText}>Chargement...</Text>
        </View>
    );

    if (isSuccess) return (
        <View style={[styles.centerContainer, { paddingHorizontal: 40 }]}>
            <View style={styles.successIconContainer}><Text style={{ fontSize: 50 }}>🎉</Text></View>
            <Text style={styles.successTitle}>Merci !</Text>
            <Text style={styles.successMessage}>Vos réponses ont bien été enregistrées.</Text>
            <TouchableOpacity 
                style={styles.retryButton} 
                onPress={() => {
                    navigation.reset({
                        index: 1,
                        routes: [{ name: "HomeMain" as any }, { name: "ConsultEtat" as any }],
                    });
                }}
            >
                <Text style={styles.retryButtonText}>Consulter mon état</Text>
            </TouchableOpacity>
        </View>
    );

    if (error || questions.length === 0) return (
        <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error || "Aucune question trouvée."}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchQuestions}>
                <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
        </View>
    );

    const qType = getQuestionType(currentQuestion);
    const selectedIds = getSelectedIdsForCurrent();

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
                    <>
                        {qType === 'smiley' && (
                            <View style={styles.smileyContainer}>
                                <View style={styles.cssSmileyRow}>
                                    {availableResponses.map((r, idx) => {
                                        const isSelected = selectedIds.includes(r.idReponse);
                                        const percent = (idx / (availableResponses.length - 1)) * 100;
                                        const mouth = getMouthTypeFromPercent(percent);
                                        return (
                                            <TouchableOpacity
                                                key={r.idReponse}
                                                onPress={() => handleResponseSelect(r.idReponse, 'single')}
                                                style={[styles.cssSmileyCircle, { backgroundColor: getHslColor(percent) }, isSelected && styles.cssSmileySelected]}
                                            >
                                                <View style={styles.cssEyesContainer}><View style={styles.cssEye} /><View style={styles.cssEye} /></View>
                                                <View style={styles.cssMouthContainer}>{renderMouth(mouth)}</View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        )}

                        {qType === 'slider' && (
                            <View style={styles.gaugeContainer}>
                                <View 
                                    style={styles.gaugeTrackContainer}
                                    onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
                                    onStartShouldSetResponder={() => true}
                                    onResponderGrant={(e) => {
                                        const percent = (e.nativeEvent.locationX / trackWidth) * 100;
                                        const closest = availableResponses.reduce((prev, curr) => 
                                            Math.abs(curr.score - percent) < Math.abs(prev.score - percent) ? curr : prev
                                        );
                                        handleResponseSelect(closest.idReponse, 'single');
                                    }}
                                >
                                    <View style={styles.gaugeTrackGradient}>
                                        {Array.from({ length: 20 }).map((_, i) => (
                                            <View key={i} style={[styles.gaugeGradientSegment, { backgroundColor: getHslColor((i / 19) * 100) }]} />
                                        ))}
                                    </View>
                                    <View style={[styles.gaugeThumbDraggable, { left: `${(availableResponses.find(r => r.idReponse === currentSelectedResponseId)?.score || 50)}%`, backgroundColor: getHslColor(availableResponses.find(r => r.idReponse === currentSelectedResponseId)?.score || 50) }]} />
                                </View>
                            </View>
                        )}

                        {(qType === 'single' || qType === 'multiple') && (
                            availableResponses.map((response) => {
                                const isSelected = selectedIds.includes(response.idReponse);
                                return (
                                    <TouchableOpacity
                                        key={response.idReponse}
                                        style={[styles.responseOption, isSelected && styles.responseOptionSelected]}
                                        onPress={() => handleResponseSelect(response.idReponse, qType === 'multiple' ? 'multiple' : 'single')}
                                    >
                                        <Text style={[styles.responseText, isSelected && styles.responseTextSelected]}>{response.texte}</Text>
                                        {isSelected && <View style={styles.checkmark}><Text style={styles.checkmarkText}>✓</Text></View>}
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </>
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
                    style={[styles.navButton, styles.nextButton, selectedIds.length === 0 && styles.navButtonDisabled]}
                    onPress={handleNext}
                    disabled={selectedIds.length === 0 || isSubmitting}
                >
                    {isSubmitting ? <ActivityIndicator size="small" color="#FFF" /> : (
                        <Text style={[styles.navButtonText, styles.nextButtonText]}>{isLastQuestion ? 'Terminer' : 'Suivant'}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.COULEUR_FOND_BLEU_CLAIR },
    scrollContent: { padding: 20, paddingBottom: 40, flexGrow: 1 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.COULEUR_FOND_BLEU_CLAIR, padding: 20 },
    successIconContainer: { marginBottom: 20, backgroundColor: '#FFF', padding: 20, borderRadius: 50, elevation: 5 },
    successTitle: { fontSize: 28, fontWeight: 'bold', color: colors.COULEUR_HEADER_BLEU, marginBottom: 10 },
    successMessage: { fontSize: 18, color: colors.COULEUR_TEXT_DARK, textAlign: 'center', marginBottom: 30 },
    progressContainer: { marginBottom: 30 },
    progressText: { fontSize: 16, color: colors.COULEUR_TEXT_DARK, marginBottom: 10, textAlign: 'center', fontWeight: '600' },
    progressBar: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: colors.COULEUR_HEADER_BLEU, borderRadius: 4 },
    questionContainer: { backgroundColor: colors.COULEUR_WHITE, borderRadius: 16, padding: 24, marginBottom: 30, elevation: 4 },
    questionText: { fontSize: 20, fontWeight: 'bold', color: colors.COULEUR_TEXT_DARK, textAlign: 'center' },
    likertContainer: { marginBottom: 30 },
    responseOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.COULEUR_WHITE, borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 2, borderColor: '#E8E8E8', elevation: 3 },
    responseOptionSelected: { borderColor: colors.COULEUR_HEADER_BLEU, backgroundColor: '#F0F7FF' },
    responseText: { flex: 1, fontSize: 16, color: colors.COULEUR_TEXT_DARK },
    responseTextSelected: { fontWeight: '600', color: colors.COULEUR_HEADER_BLEU },
    checkmark: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.COULEUR_HEADER_BLEU, alignItems: 'center', justifyContent: 'center' },
    checkmarkText: { color: colors.COULEUR_WHITE, fontWeight: 'bold' },
    navigationContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    navButton: { flex: 1, backgroundColor: '#E0E0E0', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
    nextButton: { backgroundColor: colors.COULEUR_HEADER_BLEU },
    navButtonDisabled: { opacity: 0.5 },
    navButtonText: { fontSize: 16, fontWeight: '600', color: colors.COULEUR_TEXT_DARK },
    nextButtonText: { color: colors.COULEUR_WHITE },
    loadingText: { marginTop: 10, fontSize: 16 },
    errorText: { fontSize: 16, color: '#D32F2F', textAlign: 'center', marginBottom: 20 },
    retryButton: { backgroundColor: colors.COULEUR_HEADER_BLEU, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
    retryButtonText: { color: colors.COULEUR_WHITE, fontWeight: '600' },
    
    // Smileys CSS
    smileyContainer: { alignItems: 'center', paddingVertical: 10 },
    cssSmileyRow: { flexDirection: 'row', gap: 10 },
    cssSmileyCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 5 },
    cssSmileySelected: { transform: [{ scale: 1.2 }], borderWidth: 3, borderColor: '#fff' },
    cssEyesContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '60%', position: 'absolute', top: 16 },
    cssEye: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#000' },
    cssMouthContainer: { position: 'absolute', bottom: 12 },
    cssMouth: { borderColor: '#000' },
    cssMouthVeryHappy: { borderBottomWidth: 3, borderLeftWidth: 3, borderRightWidth: 3, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    cssMouthHappy: { borderBottomWidth: 3, borderLeftWidth: 2, borderRightWidth: 2, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 },
    cssMouthNeutral: { borderBottomWidth: 3 },
    cssMouthSad: { borderTopWidth: 3, borderLeftWidth: 2, borderRightWidth: 2, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
    cssMouthVerySad: { borderTopWidth: 3, borderLeftWidth: 3, borderRightWidth: 3, borderTopLeftRadius: 20, borderTopRightRadius: 20 },

    // Slider
    gaugeContainer: { paddingVertical: 20 },
    gaugeTrackContainer: { height: 30, justifyContent: 'center' },
    gaugeTrackGradient: { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden' },
    gaugeGradientSegment: { flex: 1 },
    gaugeThumbDraggable: { position: 'absolute', width: 32, height: 32, borderRadius: 16, marginLeft: -16, borderWidth: 4, borderColor: '#fff', elevation: 10 },
});