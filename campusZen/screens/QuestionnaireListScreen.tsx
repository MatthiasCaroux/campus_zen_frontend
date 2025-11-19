import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, Alert } from "react-native";
import apiClient from "../config/axiosConfig";

type Questionnaire = {
  id: number | string;
  nomQuestionnaire?: string;
  descriptionQuestionnaire?: string;
  name?: string;
  description?: string;
};

export default function QuestionnaireListScreen() {
  const [items, setItems] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/questionnaires/");
      // try to handle different response shapes
      const data = res.data?.data ?? res.data ?? [];
      setItems(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      console.error("Erreur fetching questionnaires:", err);
      const status = err?.response?.status;
      Alert.alert("Erreur", status ? `Erreur serveur ${status}` : "Impossible de récupérer la liste");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const renderItem = ({ item }: { item: Questionnaire }) => {
    const title = item.nomQuestionnaire ?? item.name ?? "(Sans nom)";
    const desc = item.descriptionQuestionnaire ?? item.description ?? "(Pas de description)";
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Liste des questionnaires</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id ?? item.name ?? Math.random())}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={() => <Text style={styles.empty}>Aucun questionnaire trouvé</Text>}
        />
      )}

      <View style={{ marginTop: 12 }}>
        <Button title="Rafraîchir" onPress={fetchList} color="#007AFF" />
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
