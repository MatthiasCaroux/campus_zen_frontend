import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert, PanResponder, Animated, Dimensions, Image } from 'react-native';
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

    // etat pour la largeur du track du slider (pour calculer le %)
    const [trackWidth, setTrackWidth] = useState(300);

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
            const e = err as any;
            const status = e?.response?.status;
            const body = e?.response?.data ?? e?.message ?? String(e);
            // log détaillé pour debug
            // eslint-disable-next-line no-console
            console.error('[ERROR] fetchQuestions', { status, body });
            const errorMessage = (e as any)?.message || `Erreur lors du chargement des questions (${status ?? 'unknown'})`;
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
            // log détaillé de l'erreur pour debug
            // eslint-disable-next-line no-console
            console.error('[ERROR] fetchResponses failed for questionId', questionId);
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

    // debug: log current question and responses when they change
    useEffect(() => {
        try {
            // eslint-disable-next-line no-console
            console.log('[DEBUG] currentQuestion:', currentQuestion);
            // eslint-disable-next-line no-console
            console.log('[DEBUG] availableResponses:', availableResponses);
        } catch (e) {
            // ignore logging errors
        }
    }, [currentQuestion, availableResponses]);

    // actions
    // helpers to determine question input type
    const getQuestionType = (q: any) => {
        // try multiple possible property names coming from API
        const rawType = q?.type || q?.typeQuestion || q?.inputType || q?.modalite || q?.format || q?.questionType;
        if (typeof rawType === 'string') {
            const t = rawType.toLowerCase();
            // Seulement si explicitement spécifié
            if (t === 'slider' || t === 'smiley' || t === 'multiple') return t;
        }
        // fallback: if responses look like emoji labels, treat as smiley
        if (availableResponses.length > 0) {
            const texts = availableResponses.map(r => String(r.texte || '').trim());
            const emojiRx = /[\u{1F300}-\u{1F6FF}\u{1F600}-\u{1F64F}]/u;
            if (texts.some(t => emojiRx.test(t))) return 'smiley';
            // Slider seulement si le texte contient des pourcentages (ex: "Parfois (50%)")
            const hasPercentInText = texts.some(t => /\d+\s*%/.test(t));
            if (hasPercentInText) return 'slider';
        }
        // default to single choice
        return 'single';
    };

    // selection helpers: support single and multiple
    const getSelectedIdsForCurrent = () => {
        if (!currentQuestion) return [] as number[];
        return userAnswers.filter(a => a.idQuestion === currentQuestion.idQuestion).map(a => a.idReponse);
    };

    const handleResponseSelect = (responseId: number, mode: 'single' | 'multiple' = 'single') => {
        if (!currentQuestion) return;
        setUserAnswers(prevAnswers => {
            if (mode === 'multiple') {
                // toggle presence of this response id for the current question
                const existing = prevAnswers.filter(a => a.idQuestion === currentQuestion.idQuestion);
                const others = prevAnswers.filter(a => a.idQuestion !== currentQuestion.idQuestion);
                const exists = existing.some(a => a.idReponse === responseId);
                if (exists) {
                    // remove that response
                    const updatedExisting = existing.filter(a => a.idReponse !== responseId);
                    return [...others, ...updatedExisting];
                } else {
                    return [...prevAnswers, { idQuestion: currentQuestion.idQuestion, idReponse: responseId }];
                }
            }
            // single
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
        const qType = getQuestionType(currentQuestion as any);
        const selectedIds = getSelectedIdsForCurrent();
        const hasAnswer = selectedIds.length > 0 || !!currentSelectedResponseId;
        if (!hasAnswer) {
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
            // eslint-disable-next-line no-console
            console.log('[INFO] Envoi submission payload', submissionPayload);
            const resp = await apiClient.post(endpoint, submissionPayload);
            // eslint-disable-next-line no-console
            console.log('[INFO] Submission success', resp?.status ?? resp);

            // Vérifier si la réponse contient une erreur de climat
            if (resp && typeof resp === 'object' && 'error' in resp) {
                const errorMsg = (resp as any).error;
                if (errorMsg && errorMsg.includes('climat')) {
                    // Le questionnaire a été soumis mais pas de climat trouvé
                    // On considère quand même comme un succès côté user
                    console.warn('[WARN] Questionnaire soumis mais climat non trouvé:', errorMsg);
                    setIsSuccess(true);
                    return;
                }
            }

            // si pas d exception c est ok
            setIsSuccess(true);

        } catch (error: any) {
            const status = error?.response?.status;
            const body = error?.response?.data ?? error?.message ?? String(error);
            // log détaillé
            // eslint-disable-next-line no-console
            console.error('[ERROR] submit failed', { status, body });
            
            // Vérifier si c'est l'erreur de climat (pas grave pour l'utilisateur)
            const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
            if (bodyStr.includes('climat') && bodyStr.includes('score')) {
                // Le questionnaire a été enregistré mais le backend n'a pas trouvé de climat
                console.warn('[WARN] Questionnaire soumis mais climat non configuré:', bodyStr);
                setIsSuccess(true);
                return;
            }
            
            // try to show server message if present
            const serverMsg = typeof body === 'string' ? body : JSON.stringify(body);
            Alert.alert('Erreur', status ? `Erreur serveur ${status}: ${serverMsg}` : "L'envoi a échoué. Vérifiez votre connexion.");
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
                        // cast navigation to any for cross-stack navigation to ConsultEtat
                        (navigation as any).navigate('ConsultEtat');
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
                ) : (() => {
                    const qType = getQuestionType(currentQuestion as any);
                    // helper selection state
                    const selectedIds = getSelectedIdsForCurrent();


                    if (qType === 'smiley') {
                        // Données des smileys avec labels d'humeur
                        const smileyLabels = ['Très mal', 'Mal', 'Neutre', 'Bien', 'Très bien'];

                        // Fonction pour calculer la couleur HSL (rouge → vert)
                        const getHslColor = (index: number, total: number) => {
                            const hue = Math.round((index / (total - 1)) * 120);
                            return `hsl(${hue}, 70%, 50%)`;
                        };

                        // Type de bouche selon l'index
                        const getMouthType = (idx: number, total: number): string => {
                            const ratio = idx / (total - 1);
                            if (ratio <= 0.2) return 'verySad';
                            if (ratio <= 0.4) return 'sad';
                            if (ratio <= 0.6) return 'neutral';
                            if (ratio <= 0.8) return 'happy';
                            return 'veryHappy';
                        };
                        
                        const ordered = [...availableResponses].sort((a,b) => a.score - b.score);
                        const selectedIdx = ordered.findIndex(r => selectedIds.includes(r.idReponse));
                        const selectedLabel = selectedIdx >= 0 ? smileyLabels[selectedIdx] || smileyLabels[2] : null;
                        const selectedColor = selectedIdx >= 0 ? getHslColor(selectedIdx, ordered.length) : null;
                        const selectedMouth = selectedIdx >= 0 ? getMouthType(selectedIdx, ordered.length) : null;

                        const renderMouth = (mouthType: string, size: number = 26) => {
                            if (mouthType === 'veryHappy') {
                                return <View style={[styles.cssMouth, styles.cssMouthVeryHappy, { width: size, height: size * 0.5 }]} />;
                            } else if (mouthType === 'happy') {
                                return <View style={[styles.cssMouth, styles.cssMouthHappy, { width: size, height: size * 0.4 }]} />;
                            } else if (mouthType === 'neutral') {
                                return <View style={[styles.cssMouth, styles.cssMouthNeutral, { width: size * 0.6 }]} />;
                            } else if (mouthType === 'sad') {
                                return <View style={[styles.cssMouth, styles.cssMouthSad, { width: size, height: size * 0.4 }]} />;
                            } else {
                                return <View style={[styles.cssMouth, styles.cssMouthVerySad, { width: size, height: size * 0.5 }]} />;
                            }
                        };

                        return (
                            <View style={styles.smileyContainer}>
                                <View style={styles.cssSmileyRow}>
                                    {ordered.map((r, idx) => {
                                        const isSelected = selectedIds.includes(r.idReponse);
                                        const bgColor = getHslColor(idx, ordered.length);
                                        const mouthType = getMouthType(idx, ordered.length);
                                        
                                        return (
                                            <TouchableOpacity
                                                key={r.idReponse}
                                                onPress={() => handleResponseSelect(r.idReponse, 'single')}
                                                style={[
                                                    styles.cssSmileyCircle,
                                                    { backgroundColor: bgColor },
                                                    isSelected && styles.cssSmileySelected,
                                                ]}
                                                disabled={isSubmitting}
                                                activeOpacity={0.8}
                                            >
                                                <View style={styles.cssEyesContainer}>
                                                    <View style={styles.cssEye} />
                                                    <View style={styles.cssEye} />
                                                </View>
                                                <View style={styles.cssMouthContainer}>
                                                    {renderMouth(mouthType)}
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                {selectedLabel && selectedColor && selectedMouth && (
                                    <View style={[styles.smileyResultBox, { borderColor: selectedColor, borderLeftWidth: 4 }]}>
                                        <View style={[styles.cssSmileySm, { backgroundColor: selectedColor }]}>
                                            <View style={styles.cssEyesContainerSm}>
                                                <View style={styles.cssEyeSm} />
                                                <View style={styles.cssEyeSm} />
                                            </View>
                                            <View style={styles.cssMouthContainerSm}>
                                                {renderMouth(selectedMouth, 16)}
                                            </View>
                                        </View>
                                        <View style={styles.smileyResultTextContainer}>
                                            <Text style={styles.smileyResultTitle}>Votre réponse</Text>
                                            <Text style={[styles.smileyResultValue, { color: selectedColor }]}>
                                                {selectedLabel}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        );
                    }

                    if (qType === 'slider') {
                        const extractLabel = (text: string): string => {
                            return String(text).replace(/\s*\(?\d+\s*%\)?\s*/g, '').trim() || text;
                        };
                        const extractPercent = (text: string): number | null => {
                            const match = String(text).match(/(\d+)\s*%/);
                            return match ? parseInt(match[1], 10) : null;
                        };

                        const ordered = [...availableResponses].sort((a, b) => {
                            const pA = extractPercent(a.texte) ?? a.score;
                            const pB = extractPercent(b.texte) ?? b.score;
                            return pA - pB;
                        });

                        // Couleur HSL (rouge → vert)
                        const getHslColor = (percent: number) => {
                            const hue = Math.round((percent / 100) * 120);
                            return `hsl(${hue}, 70%, 50%)`;
                        };

                        // Type de bouche selon le pourcentage
                        const getMouthType = (percent: number): string => {
                            if (percent <= 20) return 'verySad';
                            if (percent <= 40) return 'sad';
                            if (percent <= 60) return 'neutral';
                            if (percent <= 80) return 'happy';
                            return 'veryHappy';
                        };

                        // Label d'humeur basé sur le pourcentage (comme pour smiley)
                        const getHumeurLabel = (percent: number): string => {
                            if (percent <= 20) return 'Très mal';
                            if (percent <= 40) return 'Mal';
                            if (percent <= 60) return 'Neutre';
                            if (percent <= 80) return 'Bien';
                            return 'Très bien';
                        };

                        // Trouver la réponse la plus proche d'un pourcentage
                        const findClosestResponse = (percent: number) => {
                            let closest = ordered[0];
                            let minDiff = Infinity;
                            for (const r of ordered) {
                                const rPercent = extractPercent(r.texte) ?? r.score;
                                const diff = Math.abs(rPercent - percent);
                                if (diff < minDiff) {
                                    minDiff = diff;
                                    closest = r;
                                }
                            }
                            return closest;
                        };

                        const selectedId = selectedIds[0] ?? null;
                        const selectedResponse = ordered.find(r => r.idReponse === selectedId);
                        const selectedPercent = selectedResponse ? (extractPercent(selectedResponse.texte) ?? selectedResponse.score) : 50;
                        const isActuallySelected = selectedId !== null;
                        
                        // Utiliser le label d'humeur au lieu du texte de la réponse
                        const selectedHumeurLabel = getHumeurLabel(selectedPercent);

                        const thumbColor = getHslColor(selectedPercent);
                        const currentMouthType = getMouthType(selectedPercent);

                        // Handler pour le touch/drag sur la barre
                        const handleTrackTouch = (locationX: number) => {
                            const percent = Math.max(0, Math.min(100, (locationX / trackWidth) * 100));
                            const closest = findClosestResponse(percent);
                            if (closest) {
                                handleResponseSelect(closest.idReponse, 'single');
                            }
                        };

                        // Fonction pour dessiner la bouche
                        const renderMouth = (mouthType: string, size: number = 26) => {
                            if (mouthType === 'veryHappy') {
                                return <View style={[styles.cssMouth, styles.cssMouthVeryHappy, { width: size, height: size * 0.5 }]} />;
                            } else if (mouthType === 'happy') {
                                return <View style={[styles.cssMouth, styles.cssMouthHappy, { width: size, height: size * 0.4 }]} />;
                            } else if (mouthType === 'neutral') {
                                return <View style={[styles.cssMouth, styles.cssMouthNeutral, { width: size * 0.6 }]} />;
                            } else if (mouthType === 'sad') {
                                return <View style={[styles.cssMouth, styles.cssMouthSad, { width: size, height: size * 0.4 }]} />;
                            } else {
                                return <View style={[styles.cssMouth, styles.cssMouthVerySad, { width: size, height: size * 0.5 }]} />;
                            }
                        };

                        return (
                            <View style={styles.gaugeContainer}>
                                {/* Smileys CSS aux extrémités avec labels */}
                                <View style={styles.gaugeLabelsTop}>
                                    <View style={styles.gaugeLabelBox}>
                                        <View style={[styles.cssSmileySm, { backgroundColor: getHslColor(0) }]}>
                                            <View style={styles.cssEyesContainerSm}>
                                                <View style={styles.cssEyeSm} />
                                                <View style={styles.cssEyeSm} />
                                            </View>
                                            <View style={styles.cssMouthContainerSm}>
                                                {renderMouth('verySad', 14)}
                                            </View>
                                        </View>
                                        <Text style={[styles.gaugeLabelText, { color: getHslColor(0) }]}>Très mal</Text>
                                    </View>
                                    <View style={styles.gaugeLabelBox}>
                                        <View style={[styles.cssSmileySm, { backgroundColor: getHslColor(100) }]}>
                                            <View style={styles.cssEyesContainerSm}>
                                                <View style={styles.cssEyeSm} />
                                                <View style={styles.cssEyeSm} />
                                            </View>
                                            <View style={styles.cssMouthContainerSm}>
                                                {renderMouth('veryHappy', 14)}
                                            </View>
                                        </View>
                                        <Text style={[styles.gaugeLabelText, { color: getHslColor(100) }]}>Très bien</Text>
                                    </View>
                                </View>

                                {/* Barre principale draggable */}
                                <View 
                                    style={styles.gaugeTrackContainer}
                                    onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
                                    onStartShouldSetResponder={() => true}
                                    onMoveShouldSetResponder={() => true}
                                    onResponderGrant={(e) => handleTrackTouch(e.nativeEvent.locationX)}
                                    onResponderMove={(e) => handleTrackTouch(e.nativeEvent.locationX)}
                                >
                                    {/* Track dégradé de fond */}
                                    <View style={styles.gaugeTrackGradient}>
                                        {Array.from({ length: 50 }, (_, i) => (
                                            <View 
                                                key={i}
                                                style={[
                                                    styles.gaugeGradientSegment,
                                                    { backgroundColor: getHslColor((i / 49) * 100) }
                                                ]}
                                            />
                                        ))}
                                    </View>

                                    {/* Curseur (thumb) */}
                                    <View 
                                        style={[
                                            styles.gaugeThumbDraggable,
                                            { 
                                                left: `${selectedPercent}%`,
                                                backgroundColor: thumbColor,
                                                opacity: isActuallySelected ? 1 : 0.7,
                                            }
                                        ]}
                                    >
                                        <View style={styles.gaugeThumbInner} />
                                    </View>
                                </View>

                                {/* Récapitulatif de la sélection - même style que smiley */}
                                {isActuallySelected && (
                                    <View style={[styles.smileyResultBox, { borderColor: thumbColor, borderLeftWidth: 4 }]}>
                                        <View style={[styles.cssSmileySm, { backgroundColor: thumbColor }]}>
                                            <View style={styles.cssEyesContainerSm}>
                                                <View style={styles.cssEyeSm} />
                                                <View style={styles.cssEyeSm} />
                                            </View>
                                            <View style={styles.cssMouthContainerSm}>
                                                {renderMouth(currentMouthType, 16)}
                                            </View>
                                        </View>
                                        <View style={styles.smileyResultTextContainer}>
                                            <Text style={styles.smileyResultTitle}>Votre réponse</Text>
                                            <Text style={[styles.smileyResultValue, { color: thumbColor }]}>
                                                {selectedHumeurLabel}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                
                                {/* Message si pas encore sélectionné */}
                                {!isActuallySelected && (
                                    <View style={styles.gaugeResultSimple}>
                                        <Text style={styles.gaugeResultSimpleLabel}>Faites glisser pour choisir</Text>
                                    </View>
                                )}
                            </View>
                        );
                    }

                    if (qType === 'multiple') {
                        return (
                            <View>
                                {availableResponses.map((response) => {
                                    const isSelected = selectedIds.includes(response.idReponse);
                                    return (
                                        <TouchableOpacity
                                            key={response.idReponse}
                                            style={[
                                                styles.responseOption,
                                                isSelected && styles.responseOptionSelected,
                                            ]}
                                            onPress={() => handleResponseSelect(response.idReponse, 'multiple')}
                                            disabled={isSubmitting}
                                        >
                                            <Text style={[styles.responseText, isSelected && styles.responseTextSelected]}>
                                                {response.texte}
                                            </Text>
                                            {isSelected && (
                                                <View style={styles.checkmark}><Text style={styles.checkmarkText}>✓</Text></View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        );
                    }

                    // default single choice
                    return (
                        <View>
                            {availableResponses.map((response) => (
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
                            ))}
                        </View>
                    );
                })()}
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
                    style={[styles.navButton, styles.nextButton, !(getSelectedIdsForCurrent().length > 0 || currentSelectedResponseId) && styles.navButtonDisabled]}
                    onPress={handleNext}
                    disabled={!(getSelectedIdsForCurrent().length > 0 || currentSelectedResponseId) || isSubmitting}
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
    
    /* Smiley styles - Design moderne */
    smileyContainer: { 
        alignItems: 'center', 
        paddingVertical: 20,
    },
    smileyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#555',
        marginBottom: 24,
        textAlign: 'center',
    },
    smileyRow: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 12,
        paddingVertical: 20,
    },
    smileyCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
        borderWidth: 3,
        borderColor: '#E9ECEF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    smileyCircleSelected: {
        transform: [{ scale: 1.15 }],
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    smileyFace: { 
        fontSize: 36,
    },
    smileyFaceSelected: { 
        fontSize: 40,
    },
    smileyImage: {
        width: 44,
        height: 44,
    },
    smileyImageSelected: {
        width: 48,
        height: 48,
    },
    smileyResultImage: {
        width: 48,
        height: 48,
        marginRight: 14,
    },
    // Anciens styles pour compatibilité
    smileyCard: {
        width: 58,
        height: 58,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderWidth: 2,
        borderColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    smileyEmoji: { 
        fontSize: 28,
    },
    smileyEmojiSelected: { 
        fontSize: 32,
    },
    smileyCheckBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    smileyCheckText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    smileyLabelsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 4,
    },
    smileyLabelItem: {
        width: 58,
        fontSize: 10,
        color: '#888',
        textAlign: 'center',
        fontWeight: '500',
    },
    smileyResultBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 28,
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    smileyResultEmoji: {
        fontSize: 36,
        marginRight: 14,
    },
    smileyResultTextContainer: {
        flexDirection: 'column',
        marginLeft: 12,
    },
    smileyResultTitle: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    smileyResultValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    /* CSS Smiley Styles */
    cssSmileyRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 15,
    },
    cssSmileyCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    cssSmileySelected: {
        transform: [{ scale: 1.2 }],
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 10,
        borderWidth: 3,
        borderColor: '#fff',
    },
    cssEyesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        position: 'absolute',
        top: 16,
    },
    cssEye: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#000',
    },
    cssMouthContainer: {
        position: 'absolute',
        bottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cssMouth: {
        borderColor: '#000',
    },
    cssMouthVeryHappy: {
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopWidth: 0,
    },
    cssMouthHappy: {
        borderBottomWidth: 3,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopWidth: 0,
    },
    cssMouthNeutral: {
        height: 0,
        borderBottomWidth: 3,
        borderRadius: 0,
    },
    cssMouthSad: {
        borderTopWidth: 3,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomWidth: 0,
    },
    cssMouthVerySad: {
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomWidth: 0,
    },
    /* Small CSS Smiley for result box */
    cssSmileySm: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cssEyesContainerSm: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '55%',
        position: 'absolute',
        top: 11,
    },
    cssEyeSm: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#000',
    },
    cssMouthContainerSm: {
        position: 'absolute',
        bottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    /* Legacy smiley styles */
    smileyButton: { 
        padding: 12, 
        borderRadius: 16, 
        alignItems: 'center', 
        justifyContent: 'center',
        minWidth: 60,
        minHeight: 60,
        backgroundColor: colors.COULEUR_WHITE,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    smileySelected: { 
        backgroundColor: '#F0F7FF',
        borderColor: colors.COULEUR_HEADER_BLEU,
        transform: [{ scale: 1.15 }],
    },
    smiley: { fontSize: 36 },
    smileySelectedText: { fontSize: 42 },
    smileyIndicator: { 
        width: 8, 
        height: 8, 
        borderRadius: 4, 
        backgroundColor: colors.COULEUR_HEADER_BLEU, 
        marginTop: 6 
    },
    smileyLabel: { 
        marginTop: 16, 
        fontSize: 16, 
        color: colors.COULEUR_TEXT_DARK, 
        fontWeight: '500',
        textAlign: 'center',
    },
    
    /* Slider avec dégradé */
    sliderContainer: { paddingVertical: 20, paddingHorizontal: 10 },
    sliderGradientTrack: { 
        flexDirection: 'row', 
        height: 20, 
        borderRadius: 10, 
        overflow: 'hidden',
        marginBottom: 60, // Plus d'espace pour les marqueurs en position absolue
        shadowColor: colors.COULEUR_BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    sliderGradientSegment: { flex: 1, height: '100%' },
    sliderMarkersRow: { 
        position: 'relative',
        height: 70,
        width: '100%',
    },
    sliderMarkerWrapper: { 
        alignItems: 'center', 
        width: 40,
        paddingVertical: 4,
    },
    sliderMarker: { 
        width: 28, 
        height: 28, 
        borderRadius: 14, 
        alignItems: 'center', 
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.COULEUR_WHITE,
        shadowColor: colors.COULEUR_BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    sliderMarkerActive: { 
        width: 36, 
        height: 36, 
        borderRadius: 18,
        borderWidth: 4,
        borderColor: colors.COULEUR_WHITE,
    },
    sliderMarkerInner: { 
        width: 12, 
        height: 12, 
        borderRadius: 6, 
        backgroundColor: colors.COULEUR_WHITE 
    },
    sliderMarkerPercent: { 
        marginTop: 8, 
        fontSize: 12, 
        color: '#888',
        fontWeight: '500',
    },
    sliderMarkerPercentActive: { 
        fontSize: 14, 
        color: colors.COULEUR_TEXT_DARK, 
        fontWeight: '700' 
    },
    sliderResultContainer: { 
        marginTop: 20, 
        padding: 16, 
        backgroundColor: colors.COULEUR_WHITE, 
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        shadowColor: colors.COULEUR_BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sliderResultText: { fontSize: 16, color: colors.COULEUR_TEXT_DARK },
    sliderResultLabel: { fontWeight: 'bold', fontSize: 18 },
    sliderResultPercent: { fontWeight: 'bold', color: colors.COULEUR_HEADER_BLEU, fontSize: 18 },
    
    /* Gauge (jauge) styles - Version stylée avec dégradé */
    gaugeContainer: { 
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    gaugeLabelsTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingHorizontal: 5,
    },
    gaugeLabelEnd: {
        fontSize: 24,
    },
    gaugeLabelBox: {
        alignItems: 'center',
    },
    gaugeLabelEmoji: {
        fontSize: 28,
    },
    gaugeLabelText: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    sliderPercentDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 10,
    },
    sliderPercentEmoji: {
        fontSize: 36,
    },
    sliderPercentValue: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    gaugeTrackContainer: {
        position: 'relative',
        height: 28,
        justifyContent: 'center',
        marginBottom: 15,
    },
    gaugeTrackGradient: {
        flexDirection: 'row',
        height: 14,
        borderRadius: 7,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    gaugeGradientSegment: {
        flex: 1,
        height: '100%',
    },
    gaugeThumbNew: {
        position: 'absolute',
        top: -1,
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: -15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 8,
    },
    gaugeThumbDraggable: {
        position: 'absolute',
        top: -8,
        width: 32,
        height: 32,
        borderRadius: 16,
        marginLeft: -16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 10,
    },
    gaugeThumbInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    gaugeResultSimple: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        paddingVertical: 10,
    },
    gaugeResultSimpleLabel: {
        fontSize: 16,
        color: '#666',
    },
    gaugeResultSimpleValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    gaugeTicksRow: {
        position: 'relative',
        height: 70,
        marginTop: 5,
    },
    gaugeTickItem: {
        position: 'absolute',
        alignItems: 'center',
        transform: [{ translateX: -30 }],
        width: 60,
    },
    gaugeTickDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    gaugeTickDotActive: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 3,
    },
    gaugeTickText: {
        fontSize: 11,
        color: '#888',
        textAlign: 'center',
        fontWeight: '500',
    },
    gaugeResultBox: {
        marginTop: 20,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    gaugeResultBoxText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    gaugeResultBoxLabel: {
        fontSize: 22,
        fontWeight: 'bold',
    },

    /* Legacy gauge styles (keep for compatibility) */
    gaugeTrack: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        position: 'relative',
        marginBottom: 30,
    },
    gaugeFill: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        backgroundColor: colors.COULEUR_HEADER_BLEU,
        borderRadius: 4,
    },
    gaugeThumb: {
        position: 'absolute',
        top: -8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.COULEUR_WHITE,
        borderWidth: 3,
        borderColor: colors.COULEUR_HEADER_BLEU,
        marginLeft: -12,
        shadowColor: colors.COULEUR_BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    gaugeTicksContainer: {
        position: 'relative',
        height: 60,
        marginTop: 10,
    },
    gaugeTickWrapper: {
        position: 'absolute',
        alignItems: 'center',
        transform: [{ translateX: -25 }],
        width: 50,
    },
    gaugeTick: {
        width: 2,
        height: 12,
        backgroundColor: '#BDBDBD',
        marginBottom: 6,
    },
    gaugeTickActive: {
        backgroundColor: colors.COULEUR_HEADER_BLEU,
        width: 3,
        height: 16,
    },
    gaugeTickLabel: {
        fontSize: 11,
        color: '#888',
        textAlign: 'center',
        fontWeight: '500',
    },
    gaugeTickLabelActive: {
        color: colors.COULEUR_HEADER_BLEU,
        fontWeight: '700',
        fontSize: 12,
    },
    gaugeResultContainer: {
        marginTop: 20,
        padding: 16,
        backgroundColor: colors.COULEUR_WHITE,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: colors.COULEUR_BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    gaugeResultText: {
        fontSize: 16,
        color: colors.COULEUR_TEXT_DARK,
    },
    gaugeResultLabel: {
        fontWeight: 'bold',
        color: colors.COULEUR_HEADER_BLEU,
        fontSize: 18,
    },
    
    /* Legacy slider styles (keep for compatibility) */
    sliderWrapper: { alignItems: 'center' },
    sliderTrack: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 6 },
    sliderTickWrapper: { flex: 1, alignItems: 'center' },
    sliderTick: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E0E0E0', marginBottom: 8 },
    sliderTickActive: { backgroundColor: colors.COULEUR_HEADER_BLEU },
    sliderLabel: { fontSize: 12, color: colors.COULEUR_TEXT_DARK, textAlign: 'center' },
    sliderPercentText: { marginTop: 8, fontSize: 14, color: colors.COULEUR_TEXT_DARK, fontWeight: '600' },
});