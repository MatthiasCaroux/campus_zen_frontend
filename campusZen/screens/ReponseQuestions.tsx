import React, { useEffect, useState } from "react";
import { View, Button, Text, StyleSheet, ActivityIndicator, FlatList, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import apiClient from "../config/axiosConfig";

type Reponse = {
    idReponse?: number | string;
    id?: number | string;
    texte?: string;
    score?: number;
    question?: number | string;
};

export default function ReponseQuestions({ route }: any) {
    const navigation = useNavigation<any>();
    const questionId = route?.params?.questionId ?? route?.params?.question?.idQuestion ?? route?.params?.question;
    const [items, setItems] = useState<Reponse[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchResponses = async () => {
        if (!questionId) {
            Alert.alert("Erreur", "Identifiant de la question introuvable.");
            return;
        }
        setLoading(true);
        try {
            const res = await apiClient.get(`/reponses/?question=${encodeURIComponent(String(questionId))}`);
            const raw = res?.data?.data ?? res?.data?.results ?? res?.data;
            const data = Array.isArray(raw) ? raw : Array.isArray(res?.data?.reponses) ? res.data.reponses : [];
            setItems(data as Reponse[]);
        } catch (err: any) {
            const status = err?.response?.status;
            Alert.alert("Erreur", status ? `Erreur serveur ${status}` : "Impossible de récupérer les réponses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (questionId !== undefined && questionId !== null) fetchResponses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionId]);

    useFocusEffect(
        React.useCallback(() => {
            if (questionId !== undefined && questionId !== null) fetchResponses();
        }, [questionId])
    );

    const normalizeResponseId = (r: Reponse) => {
        const id = r.idReponse ?? r.id;
        console.log("[ID] normalizeResponseId input:", r, "output:", id);
        return id;
    };

    const onDeleteResponse = async (idReponse: number | string) => {
        console.log("Delete response confirm dialog", { idReponse });
        Alert.alert("Confirmation", "Supprimer cette réponse ?", [
            { text: "Annuler", style: "cancel" },
            {
                text: "Supprimer",
                style: "destructive",
                onPress: async () => {
                    console.log("[DELETE] Response confirmed", { idReponse });
                    try {
                        setLoading(true);
                        let success = false;
                        try {
                            console.log("[DELETE] Essai /reponses/{id}/");
                            await apiClient.delete(`/reponses/${idReponse}/`);
                            console.log("[DELETE] Succès /reponses/{id}/");
                            success = true;
                        } catch (e1: any) {
                            const st = e1?.response?.status;
                            console.log("[DELETE] Erreur /reponses/{id}/", { status: st });
                            if (st === 404 || st === 405) {
                                try {
                                    console.log("[DELETE] Essai /reponse/{id}/");
                                    await apiClient.delete(`/reponse/${idReponse}/`);
                                    console.log("[DELETE] Succès /reponse/{id}/");
                                    success = true;
                                } catch (e2: any) {
                                    console.log("[DELETE] Erreur /reponse/{id}/", { status: e2?.response?.status });
                                    throw e2;
                                }
                            } else {
                                throw e1;
                            }
                        }
                        setLoading(false);
                        if (success) setItems((prev) => prev.filter((r) => String(normalizeResponseId(r)!) !== String(idReponse)));
                    } catch (e: any) {
                        setLoading(false);
                        const status = e?.response?.status;
                        const body = typeof e?.response?.data === "string" ? e.response.data.slice(0, 400) : JSON.stringify(e?.response?.data ?? {});
                        console.log("[DELETE] Erreur finale", { status, body });
                        Alert.alert("Erreur", status ? `Erreur serveur ${status}` : "Suppression impossible");
                    }
                },
            },
        ]);
    };

    const goToAddResponse = () => {
        if (!questionId) {
            Alert.alert("Erreur", "Identifiant de la question introuvable.");
            return;
        }
        navigation.navigate("ResponseForm", { mode: "create", questionId, question: route?.params?.question });
    };

    const renderItem = ({ item }: { item: Reponse }) => {
        const itemId = normalizeResponseId(item);
        return (
            <View style={styles.card}>
                <Text style={styles.title}>{item.texte ?? "(Sans texte)"}</Text>
                <Text style={styles.desc}>{item.score != null ? `Score: ${item.score}` : "(Pas de score)"}</Text>
                <View style={{ marginTop: 8 }}>
                    <Button title="Supprimer" color="#FF3B30" onPress={() => {
                        console.log("Delete response button pressed", { itemId, item });
                        if (itemId != null) onDeleteResponse(itemId);
                    }} />
                </View>
                <View style={{ marginTop: 8 }}>
                    <Button
                        title="Modifier"
                        color="#FF9500"
                        onPress={() => navigation.navigate("ResponseForm", { mode: "edit", questionId, response: item })}
                    />
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Réponses de la question</Text>
            {route?.params?.question?.intituleQuestion ? (
                <Text style={styles.subHeader}>{String(route.params.question.intituleQuestion)}</Text>
            ) : null}
            <View style={{ marginBottom: 12, gap: 8 }}>
                <Button title="Retour" onPress={() => navigation.goBack()} color="#6c757d" />
                <Button title="Ajouter une réponse" onPress={goToAddResponse} color="#28A745" />
            </View>
            {loading ? (
                <ActivityIndicator size="small" color="#007AFF" />
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => String(normalizeResponseId(item) ?? Math.random())}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    ListEmptyComponent={() => <Text style={styles.empty}>Aucune réponse trouvée</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    header: { fontSize: 18, fontWeight: "600", marginBottom: 12, textAlign: "center" },
    subHeader: { fontSize: 14, color: "#444", marginBottom: 8, textAlign: "center" },
    card: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#e6e6e6", backgroundColor: "#fafafa" },
    title: { fontSize: 16, fontWeight: "600" },
    desc: { marginTop: 6, color: "#444" },
    empty: { textAlign: "center", marginTop: 8, color: "#666" },
});