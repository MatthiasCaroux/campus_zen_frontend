import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ActivityIndicator,
} from "react-native";
import { apiClient } from "../../services/apiClient";
import { useNavigation } from "@react-navigation/native";

export default function QuestionnaireScreen({ route }: any) {
    const [nomQuestionnaire, setNomQuestionnaire] = useState("");
    const [descriptionQuestionnaire, setDescriptionQuestionnaire] = useState("");
    const [loading, setLoading] = useState(false);
    const isEdit = route?.params?.mode === "edit";
    const editId =
        route?.params?.questionnaireId ??
        route?.params?.questionnaire?.idQuestionnaire ??
        route?.params?.questionnaire?.id;

    useEffect(() => {
        if (isEdit && route?.params?.questionnaire) {
            const q = route.params.questionnaire;
            setNomQuestionnaire(q?.nomQuestionnaire ?? "");
            setDescriptionQuestionnaire(q?.descriptionQuestionnaire ?? "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit]);

    const handleSubmit = async () => {
        if (!nomQuestionnaire.trim()) {
            Alert.alert("Erreur", "Le nom du questionnaire est requis.");
            return;
        }

        setLoading(true);
        try {
            const payload = { nomQuestionnaire: nomQuestionnaire.trim(), descriptionQuestionnaire: descriptionQuestionnaire.trim() };
            console.log("Sending questionnaire payload:", payload);

            if (isEdit && editId) {
                try {
                    await apiClient.put(`/questionnaires/${encodeURIComponent(String(editId))}/`, payload);
                } catch (e1: any) {
                    const st = e1?.response?.status;
                    if (st === 404 || st === 405) {
                        await apiClient.put(`/questionnaire/${encodeURIComponent(String(editId))}/`, payload);
                    } else {
                        throw e1;
                    }
                }
            } else {
                await apiClient.post("/questionnaires/", payload);
            }

            setLoading(false);
            console.log("Questionnaire saved successfully", { editId });
            Alert.alert("Succès", isEdit ? "Questionnaire modifié avec succès." : "Questionnaire créé avec succès.");
            // Reset form
            if (!isEdit) {
                setNomQuestionnaire("");
                setDescriptionQuestionnaire("");
            }
        } catch (error: any) {
            console.log("Error saving questionnaire", { editId });
            setLoading(false);
            console.error("Erreur lors de l'envoi du questionnaire:", error);

            // Extra logging for debugging 500
            if (error?.response) {
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
                // If server returned HTML (stack trace page) or JSON, log a short preview
                const body = typeof error.response.data === "string"
                    ? error.response.data.substring(0, 2000)
                    : JSON.stringify(error.response.data);
                console.error("Response body (preview):", body);
                Alert.alert(
                    "Erreur serveur",
                    `Le serveur a retourné ${error.response.status}. Vérifiez les logs du backend.`
                );
            } else {
                const message = error.message || "Erreur réseau";
                Alert.alert("Erreur", `Impossible d'envoyer le questionnaire: ${message}`);
            }
        }
    };

    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isEdit ? "Modifier un questionnaire" : "Questionnaire"}</Text>
            <Text style={styles.subtitle}>Participez à notre questionnaire pour améliorer votre expérience</Text>

            <View style={{ marginBottom: 12 }}>
                <Button title="Retour" onPress={() => navigation.goBack()} color="#6c757d" />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Nom du questionnaire</Text>
                <TextInput
                    value={nomQuestionnaire}
                    onChangeText={setNomQuestionnaire}
                    placeholder="Entrer le nomffffff"
                    style={styles.input}
                    accessibilityLabel="name-input"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    value={descriptionQuestionnaire}
                    onChangeText={setDescriptionQuestionnaire}
                    placeholder="Entrer la description"
                    style={[styles.input, styles.textarea]}
                    multiline
                    numberOfLines={4}
                    accessibilityLabel="description-input"
                />
            </View>

            {loading ? (
                <ActivityIndicator size="small" color="#007AFF" />
            ) : (
                <Button title={isEdit ? "Enregistrer" : "Envoyer"} onPress={handleSubmit} color="#007AFF" />
            )}
            {!isEdit && (
                <Button
                    title="Liste des questionnaires"
                    onPress={() => {
                        navigation.navigate("QuestionnaireList");
                    }}
                    color="#007AFF"
                />
            )}

            {isEdit && editId && !loading && (
                <View style={{ marginTop: 12 }}>
                    <Button
                        title="Supprimer ce questionnaire"
                        onPress={() => {
                            Alert.alert(
                                "Confirmation",
                                "Supprimer ce questionnaire ?",
                                [
                                    { text: "Annuler", style: "cancel" },
                                    {
                                        text: "Supprimer",
                                        style: "destructive",
                                        onPress: async () => {
                                            console.log("[DELETE] Tentative suppression questionnaire", { editId });
                                            try {
                                                setLoading(true);
                                                let success = false;
                                                try {
                                                    console.log("[DELETE] Essai /questionnaires/{id}/");
                                                    await apiClient.delete(`/questionnaires/${editId}/`);
                                                    console.log("[DELETE] Succès /questionnaires/{id}/");
                                                    success = true;
                                                } catch (e1: any) {
                                                    const st = e1?.response?.status;
                                                    console.log("[DELETE] Erreur /questionnaires/{id}/", { status: st });
                                                    if (st === 404 || st === 405) {
                                                        try {
                                                            console.log("[DELETE] Essai /questionnaire/{id}/");
                                                            await apiClient.delete(`/questionnaire/${editId}/`);
                                                            console.log("[DELETE] Succès /questionnaire/{id}/");
                                                            success = true;
                                                        } catch (e2: any) {
                                                            console.log("[DELETE] Erreur /questionnaire/{id}/", { status: e2?.response?.status });
                                                            throw e2;
                                                        }
                                                    } else {
                                                        throw e1;
                                                    }
                                                }
                                                setLoading(false);
                                                if (success) {
                                                    Alert.alert("Succès", "Questionnaire supprimé.");
                                                    navigation.navigate("QuestionnaireList");
                                                }
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
                        }}
                        color="#FF3B30"
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        textAlign: "center",
        marginBottom: 16,
        color: "#333",
    },
    formGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
        backgroundColor: "#fff",
    },
    textarea: {
        minHeight: 80,
        textAlignVertical: "top",
    },
});


