import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { apiClient } from "../services/apiClient";
import { useNavigation } from "@react-navigation/native";

type Questions = {
    idQuestion: number | string;
    intituleQuestion?: string;
    poids?: number;
    idQuestionnaire?: number | string;
};

export default function QuestionnaireQuestions({ route }: any) {
    const [items, setItems] = useState<Questions[]>([]);
    

    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();
    const getQuestionId = (q: Partial<Questions> | any): string | number | undefined =>
        q?.idQuestion ?? q?.id ?? q?.question?.id ?? q?.questionId;
    const questionnaireId =
        route?.params?.questionnaireId ||
        route?.params?.idQuestionnaire ||
        route?.params?.id ||
        route?.params?.questionnaire?.idQuestionnaire ||
        route?.params?.questionnaire?.id;

    const onDeleteQuestion = async (idQuestion: number | string) => {
        if (!questionnaireId) {
            Alert.alert("Erreur", "ID du questionnaire introuvable.");
            return;
        }
        console.log("Delete question confirm dialog", { idQuestion, questionnaireId });
        Alert.alert(
            "Confirmation",
            "Supprimer cette question ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        console.log("[DELETE] Question confirmed", { idQuestion });
                        try {
                            setLoading(true);
                            let success = false;
                            try {
                                console.log("[DELETE] Essai /questions/{id}/");
                                await apiClient.delete(
                                    `/questions/${idQuestion}/`
                                );
                                console.log("[DELETE] Succès /questions/{id}/");
                                success = true;
                            } catch (e1: any) {
                                const st = e1?.response?.status;
                                console.log("[DELETE] Erreur /questions/{id}/", { status: st });
                                if (st === 404 || st === 405) {
                                    try {
                                        console.log("[DELETE] Essai /question/{id}/");
                                        await apiClient.delete(
                                            `/question/${idQuestion}/`
                                        );
                                        console.log("[DELETE] Succès /question/{id}/");
                                        success = true;
                                    } catch (e2: any) {
                                        console.log("[DELETE] Erreur /question/{id}/", { status: e2?.response?.status });
                                        throw e2;
                                    }
                                } else {
                                    throw e1;
                                }
                            }
                            setLoading(false);
                            if (success) await fetchQuestions();
                        } catch (e: any) {
                            setLoading(false);
                            const status = e?.response?.status;
                            const body = typeof e?.response?.data === "string" ? e.response.data.slice(0, 400) : JSON.stringify(e?.response?.data ?? {});
                            console.log("[DELETE] Erreur finale", { status, body });
                            Alert.alert("Erreur", status ? `Erreur serveur ${status}` : "Suppression impossible");
                        }
                    },
                },
            ]
        );
    };

    // Navigation vers le formulaire d'ajout
    const goToAddQuestion = () => {
        if (!questionnaireId) {
            Alert.alert("Erreur", "ID du questionnaire introuvable.");
            return;
        }
        navigation.navigate("QuestionForm", {
            mode: "create",
            questionnaireId,
            questionnaire: route?.params?.questionnaire,
        });
    };

    const fetchQuestions = async () => {
        

        if (questionnaireId === undefined || questionnaireId === null) {
            console.warn("Missing questionnaireId, route.params:", route?.params);
            Alert.alert("Paramètre manquant", "Identifiant du questionnaire introuvable.");
            return;
        }

        setLoading(true);
        try {
            console.log("Fetching questions for questionnaireId:", questionnaireId);
            const data = await apiClient.get(
                `/questions/?questionnaireId=${questionnaireId}`
            );

            setItems(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Erreur fetching questions:", err);
            const status = err?.response?.status;
            Alert.alert("Erreur", status ? `Erreur serveur ${status}` : "Impossible de récupérer la liste");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const qid =
            route?.params?.questionnaireId ??
            route?.params?.idQuestionnaire ??
            route?.params?.id ??
            route?.params?.questionnaire?.idQuestionnaire ??
            route?.params?.questionnaire?.id;
        if (qid !== undefined && qid !== null) {
            fetchQuestions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route?.params?.questionnaireId, route?.params?.idQuestionnaire, route?.params?.id]);

    const renderItem = ({ item }: { item: Questions }) => {
        const title = item.intituleQuestion ?? "(Sans nom)";
        const desc = item.poids ?? "(Pas de poids)";
            const goToAddQuestion = () => {
                if (!questionnaireId) {
                    Alert.alert("Erreur", "ID du questionnaire introuvable.");
                    return;
                }
                navigation.navigate("QuestionForm", {
                    mode: "create",
                    questionnaireId,
                    questionnaire: route?.params?.questionnaire,
                });
            };
        return (
            <View style={styles.card}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.desc}>{desc}</Text>
                <View style={{ marginTop: 8 }}>
                    <Button title="Supprimer la question" color="#FF3B30" onPress={() => {
                        console.log("Delete question button pressed", { item });
                        const qid = getQuestionId(item);
                        if (qid == null) {
                            Alert.alert("Erreur", "ID de la question introuvable.");
                            return;
                        }
                        onDeleteQuestion(qid);
                    }} />
                </View>
                <View style={{ marginTop: 8 }}>
                    <Button
                        title="Modifier la question"
                        color="#FF9500"
                        onPress={() => navigation.navigate("QuestionForm", {
                            mode: "edit",
                            questionnaireId,
                            question: item,
                        })}
                    />
                </View>
                <View style={{ marginTop: 8 }}>
                    <Button
                        title="Réponses"
                        color="#007AFF"
                        onPress={() => navigation.navigate("ReponseQuestions", {
                            questionId: getQuestionId(item),
                            question: item,
                        })}
                    />
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Liste des questions</Text>
            <View style={{ marginBottom: 12, gap: 8 }}>
                <Button title="Retour" onPress={() => navigation.goBack()} color="#6c757d" />
                <Button title="Ajouter une question" onPress={goToAddQuestion} color="#28A745" />
                <Button
                    title="Modifier le questionnaire"
                    onPress={() => navigation.navigate("QuestionnaireMain", {
                        mode: "edit",
                        questionnaireId,
                        questionnaire: route?.params?.questionnaire,
                    })}
                    color="#FF9500"
                />
            </View>
            {loading ? (
                <ActivityIndicator size="small" color="#007AFF" />
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => String(getQuestionId(item) ?? item.intituleQuestion ?? Math.random())}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    ListEmptyComponent={() => <Text style={styles.empty}>Aucun question trouvé</Text>}
                />
            )}

            <View style={{ marginTop: 12 }}>
                <Button title="Rafraîchir" onPress={fetchQuestions} color="#007AFF" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        textAlign: "center",
    },
    card: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e6e6e6",
        backgroundColor: "#fafafa",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
    },
    desc: {
        marginTop: 6,
        color: "#444",
    },
    empty: {
        textAlign: "center",
        marginTop: 8,
        color: "#666",
    },
});