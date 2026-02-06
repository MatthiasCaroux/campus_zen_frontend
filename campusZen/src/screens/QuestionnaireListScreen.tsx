import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { apiClient } from "../services/apiClient";

type Questionnaire = {
  id: number | string;
  nomQuestionnaire?: string;
  descriptionQuestionnaire?: string;
  name?: string;
  description?: string;
  idQuestionnaire?: number | string;
};
export default function QuestionnaireListScreen() {
  // ecran admin liste questionnaires avec actions
  const [items, setItems] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const fetchList = async () => {
    setLoading(true);
    try {
      // recupere la liste complete
      const data = await apiClient.get("/questionnaires/");
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
    // gestion de plusieurs formats possibles renvoyes par l api
    const title =
      item.nomQuestionnaire?.trim() ||
      item.name?.trim() ||
      (item.id !== undefined && item.id !== null ? String(item.id) : undefined) ||
      "(Sans nom)";
    const desc = item.descriptionQuestionnaire || "(Pas de description)";
    const ListActions = () => {
      // actions navigate edit delete
      const questionnaireId = item?.id ?? (item as any)?.idQuestionnaire;
      return (
        <View style={{ marginTop: 12, gap: 8 }}>
          <Button
            title="Liste des questions"
            onPress={() =>
              navigation.navigate("QuestionnaireQuestions", {
                questionnaireId,
                questionnaire: item,
              })
            }
            color="#007AFF"
          />
          <Button
            title="Modifier"
            onPress={() =>
              navigation.navigate("QuestionnaireMain", {
                mode: "edit",
                questionnaireId,
                questionnaire: item,
              })
            }
            color="#FF9500"
          />
          <Button
            title="Supprimer"
            onPress={() => {
              // delete avec fallback sur deux endpoints
              const questionnaireId = item?.id ?? (item as any)?.idQuestionnaire;
              console.log("Delete questionnaire (list) button pressed", { item, questionnaireId, itemId: item?.id, itemIdQuestionnaire: (item as any)?.idQuestionnaire });
              if (!questionnaireId) {
                Alert.alert("Erreur", "ID du questionnaire introuvable.");
                return;
              }
              Alert.alert(
                "Confirmation",
                "Supprimer ce questionnaire ?",
                [
                  { text: "Annuler", style: "cancel" },
                  {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                      console.log("[DELETE] Questionnaire (list) confirmed", { questionnaireId });
                      console.log("[DELETE] ID encoded:", encodeURIComponent(String(questionnaireId)));
                      try {
                        setLoading(true);
                        let success = false;
                        try {
                          const url = `/questionnaires/${questionnaireId}/`;
                          console.log("[DELETE] Full URL:", url);
                          await apiClient.delete(url);
                          console.log("[DELETE] Succès /questionnaires/{id}/");
                          success = true;
                        } catch (error_: any) {
                          const st = error_?.response?.status;
                          console.log("[DELETE] Erreur /questionnaires/{id}/", { status: st, message: error_?.message });
                          if (st === 404 || st === 405) {
                            try {
                              console.log("[DELETE] Essai /questionnaire/{id}/");
                              await apiClient.delete(`/questionnaire/${questionnaireId}/`);
                              console.log("[DELETE] Succès /questionnaire/{id}/");
                              success = true;
                            } catch (error__: any) {
                              console.log("[DELETE] Erreur /questionnaire/{id}/", { status: error__?.response?.status });
                              throw error__;
                            }
                          } else {
                            throw error_;
                          }
                        }
                        setLoading(false);
                        if (success) await fetchList();
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
      );
    };
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
        <ListActions />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Liste des questionnaires</Text>
      <View style={{ marginBottom: 12 }}>
        <Button title="Retour" onPress={() => navigation.goBack()} color="#6c757d" />
      </View>
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
