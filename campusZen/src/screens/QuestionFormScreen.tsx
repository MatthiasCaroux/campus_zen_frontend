import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { apiClient } from "../services/apiClient";

// Le formulaire de création/édition d'une question
// Attendu dans route.params:
// - questionnaireId: number|string (obligatoire)
// - mode: 'create' | 'edit'
// - question: { idQuestion, intituleQuestion, poids } (en mode edit)
export default function QuestionFormScreen({ route }: any) {
  const navigation = useNavigation<any>();
  const mode: "create" | "edit" = route?.params?.mode || "create";
  const questionnaireId =
    route?.params?.questionnaireId ??
    route?.params?.question?.idQuestionnaire ??
    route?.params?.questionnaire?.idQuestionnaire ??
    route?.params?.questionnaire?.id;

  const [intituleQuestion, setIntituleQuestion] = useState<string>("");
  const [poids, setPoids] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && route?.params?.question) {
      const q = route.params.question;
      setIntituleQuestion(q?.intituleQuestion ?? "");
      setPoids(q?.poids != null ? String(q.poids) : "");
    }
  }, [mode]);

  const handleSubmit = async () => {
    if (!intituleQuestion.trim()) {
      Alert.alert("Erreur", "L'intitulé de la question est requis.");
      return;
    }
    if (!questionnaireId) {
      Alert.alert("Erreur", "Identifiant de questionnaire manquant.");
      return;
    }

    // Convertir le poids en nombre si renseigné
    const poidsValue = poids.trim() === "" ? undefined : Number(poids);
    if (poidsValue !== undefined && Number.isNaN(poidsValue)) {
      Alert.alert("Erreur", "Le poids doit être un nombre valide.");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        intituleQuestion: intituleQuestion.trim(),
      };
      if (poidsValue !== undefined) payload.poids = poidsValue;

    if (mode === "edit" && route?.params?.question?.idQuestion) {
      const idQuestion = route.params.question.idQuestion;
      try {
        await apiClient.put(
          `/questions/${encodeURIComponent(String(idQuestion))}/`,
          payload,
          { headers: { Accept: "application/json" } }
        );
      } catch (e: any) {
        Alert.alert("Erreur", "Impossible de modifier la question.");
        return;
      }
      Alert.alert("Succès", "Question modifiée.");
    } else {
      try {
        await apiClient.post(
          `/questions/`,
          { ...payload, questionnaire: questionnaireId },
          { headers: { Accept: "application/json" } }
        );
      } catch (e: any) {
        Alert.alert("Erreur", "Impossible de créer la question.");
        return;
      }
      Alert.alert("Succès", "Question créée.");
    }

      navigation.goBack();
    } catch (error: any) {
      const status = error?.response?.status;
      const body =
        typeof error?.response?.data === "string"
          ? error.response.data.slice(0, 300)
          : JSON.stringify(error?.response?.data ?? {});
      Alert.alert("Erreur", status ? `Erreur serveur ${status}` : "Operation impossible");
      if (status) console.log("Body:", body);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === "edit" ? "Modifier une question" : "Ajouter une question"}</Text>
      <View style={{ marginBottom: 12 }}>
        <Button title="Retour" onPress={() => navigation.goBack()} color="#6c757d" />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Intitulé de la question</Text>
        <TextInput
          value={intituleQuestion}
          onChangeText={setIntituleQuestion}
          placeholder="Ex: Votre niveau de stress ?"
          style={styles.input}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Poids (optionnel)</Text>
        <TextInput
          value={poids}
          onChangeText={setPoids}
          keyboardType="numeric"
          placeholder="Ex: 10"
          style={styles.input}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : (
        <Button title={mode === "edit" ? "Enregistrer" : "Envoyer"} onPress={handleSubmit} color="#007AFF" />
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
    opacity: 0.6,
  },
});