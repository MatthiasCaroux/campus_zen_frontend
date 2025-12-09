import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../config/axiosConfig";

export default function ResponseFormScreen({ route }: any) {
  const navigation = useNavigation<any>();
  const mode: "create" | "edit" = route?.params?.mode || "create";
  const questionId = route?.params?.questionId ?? route?.params?.response?.question;

  const [texte, setTexte] = useState<string>("");
  const [score, setScore] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && route?.params?.response) {
      const r = route.params.response;
      setTexte(r?.texte ?? "");
      setScore(r?.score != null ? String(r.score) : "");
    }
  }, [mode]);

  const handleSubmit = async () => {
    if (!texte.trim()) {
      Alert.alert("Erreur", "Le texte de la réponse est requis.");
      return;
    }
    if (!questionId) {
      Alert.alert("Erreur", "Identifiant de la question manquant.");
      return;
    }

    const scoreValue = score.trim() === "" ? undefined : Number(score);
    if (scoreValue !== undefined && Number.isNaN(scoreValue)) {
      Alert.alert("Erreur", "Le score doit être un nombre valide.");
      return;
    }

    setLoading(true);
    try {
      const payload: any = { texte: texte.trim() };
      if (scoreValue !== undefined) payload.score = scoreValue;

      if (mode === "edit" && (route?.params?.response?.idReponse != null || route?.params?.response?.id != null)) {
        const idReponse = route.params.response.idReponse ?? route.params.response.id;
        await apiClient.put(`/reponses/${idReponse}/`, { ...payload, question: questionId }, { headers: { Accept: "application/json" } });
        Alert.alert("Succès", "Réponse modifiée.");
      } else {
        await apiClient.post(`/reponses/`, { ...payload, question: questionId }, { headers: { Accept: "application/json" } });
        Alert.alert("Succès", "Réponse créée.");
      }

      navigation.goBack();
    } catch (error: any) {
      const status = error?.response?.status;
      const body = typeof error?.response?.data === "string" ? error.response.data.slice(0, 300) : JSON.stringify(error?.response?.data ?? {});
      Alert.alert("Erreur", status ? `Erreur serveur ${status}` : "Operation impossible");
      if (status) console.log("Body:", body);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === "edit" ? "Modifier une réponse" : "Ajouter une réponse"}</Text>
      <View style={{ marginBottom: 12 }}>
        <Button title="Retour" onPress={() => navigation.goBack()} color="#6c757d" />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Texte de la réponse</Text>
        <TextInput value={texte} onChangeText={setTexte} placeholder="Ex: Oui" style={styles.input} />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Score (optionnel)</Text>
        <TextInput value={score} onChangeText={setScore} keyboardType="numeric" placeholder="Ex: 5" style={styles.input} />
      </View>

      {loading ? <ActivityIndicator size="small" color="#007AFF" /> : <Button title={mode === "edit" ? "Enregistrer" : "Envoyer"} onPress={handleSubmit} color="#007AFF" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "600", textAlign: "center", marginBottom: 8 },
  formGroup: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, fontSize: 14, backgroundColor: "#fff" },
})