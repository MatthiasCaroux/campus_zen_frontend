import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ActivityIndicator,
} from "react-native";
import apiClient from "../config/axiosConfig";
import { useNavigation } from "@react-navigation/native";

export default function QuestionnaireScreen() {
    const [nomQuestionnaire, setNomQuestionnaire] = useState("");
    const [descriptionQuestionnaire, setDescriptionQuestionnaire] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!nomQuestionnaire.trim()) {
            Alert.alert("Erreur", "Le nom du questionnaire est requis.");
            return;
        }

        setLoading(true);
        try {
            const payload = { nomQuestionnaire: nomQuestionnaire.trim(), descriptionQuestionnaire: descriptionQuestionnaire.trim() };
            console.log("Sending questionnaire payload:", payload);

            const response = await apiClient.post("/questionnaires/", payload, {
                headers: { Accept: "application/json" },
            });

            setLoading(false);
            Alert.alert("Succès", "Questionnaire créé avec succès.");
            // Reset form
            setNomQuestionnaire("");
            setDescriptionQuestionnaire("");
            console.log("API response status:", response.status);
            console.log("API response data:", response.data);
        } catch (error: any) {
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
            <Text style={styles.title}>Questionnaire</Text>
            <Text style={styles.subtitle}>Participez à notre questionnaire pour améliorer votre expérience</Text>

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
                <Button title="Envoyer" onPress={handleSubmit} color="#007AFF" />
            )}

            <Button
                title="Liste des questionnaires"
                onPress={() => {
                    navigation.navigate("QuestionnaireList");
                }}
                color="#007AFF"
            />
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


