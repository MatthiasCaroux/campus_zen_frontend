import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ressourcesFormStyles } from "../screenStyles/RessourcesFormStyle";
import { createRessource, deleteRessource, getRessourceById, updateRessource } from "../services/RessourceProvider";

type RessourceFormRouteProp = RouteProp<{ RessourceForm: { ressourceId?: number } }, "RessourceForm">;

const choices_typeR = [
    { value: "article", label: "Article", icon: "document-text-outline" },
    { value: "video", label: "Vidéo", icon: "play-circle-outline" },
    { value: "podcast", label: "Podcast", icon: "mic-outline" },
    { value: "livre", label: "Livre", icon: "book-outline" },
    { value: "site_web", label: "Site Web", icon: "globe-outline" },
    { value: "documentaire", label: "Documentaire", icon: "film-outline" },
    { value: "film", label: "Film", icon: "videocam-outline" },
    { value: "formation", label: "Formation", icon: "school-outline" },
    { value: "autre", label: "Autre", icon: "cube-outline" },
];

export default function RessourceFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<RessourceFormRouteProp>();
  const ressourceId = route.params?.ressourceId ?? null;

  const isEditing = !!ressourceId;

  const [loading, setLoading] = useState<boolean>(true);
  const [form, setForm] = useState({
    titreR: "",
    descriptionR: "",
    typeR: "",
    lienR: "",
  });

  useEffect(() => {
    async function fetchData() {
      if (!isEditing) {
        setLoading(false);
        return;
      }
      try {
        const data = await getRessourceById(ressourceId!);
        setForm({
          titreR: data.titreR,
          descriptionR: data.descriptionR,
          typeR: data.typeR,
          lienR: data.lienR,
        });
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      }
      setLoading(false);
    }
    fetchData();
  }, [ressourceId]);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.titreR.trim() || !form.descriptionR.trim() || !form.typeR || !form.lienR.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (form.lienR && !/^https?:\/\/\S+$/.test(form.lienR)) {
      Alert.alert("Erreur", "Le lien doit être une URL valide.");
      return;
    }

    try {
      if (isEditing) {
        await updateRessource(ressourceId!, form);
        Alert.alert("Succès", "Ressource mise à jour !");
      } else {
        await createRessource(form);
        Alert.alert("Succès", "Ressource créée !");
      }
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible d'enregistrer la ressource.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer",
      "Voulez-vous vraiment supprimer cette ressource ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await deleteRessource(ressourceId!);
            Alert.alert("Supprimé", "La ressource a été supprimée.");
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={ressourcesFormStyles.loadingContainer}>
        <Text style={ressourcesFormStyles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={ressourcesFormStyles.container}>
      
      {/* HEADER */}
      <View style={ressourcesFormStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={ressourcesFormStyles.headerTitle}>
          {isEditing ? "Modifier la ressource" : "Créer une ressource"}
        </Text>
      </View>

      <ScrollView style={ressourcesFormStyles.scrollView} contentContainerStyle={ressourcesFormStyles.scrollContent}>

        {/* Titre */}
        <View style={ressourcesFormStyles.section}>
          <Text style={ressourcesFormStyles.label}>Titre *</Text>
          <TextInput
            style={ressourcesFormStyles.input}
            value={form.titreR}
            onChangeText={(v) => handleChange("titreR", v)}
            placeholder="Nom de la ressource"
          />
        </View>

        {/* Description */}
        <View style={ressourcesFormStyles.section}>
          <Text style={ressourcesFormStyles.label}>Description *</Text>
          <TextInput
            style={[ressourcesFormStyles.input, ressourcesFormStyles.textarea]}
            multiline
            value={form.descriptionR}
            onChangeText={(v) => handleChange("descriptionR", v)}
            placeholder="Décrivez la ressource..."
          />
        </View>

        {/* Type avec Chips */}
        <View style={ressourcesFormStyles.section}>
          <Text style={ressourcesFormStyles.label}>Type *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {choices_typeR.map((choice) => {
              const active = form.typeR === choice.value;
              return (
                <TouchableOpacity
                  key={choice.value}
                  style={[
                    ressourcesFormStyles.typeChip,
                    active && ressourcesFormStyles.typeChipActive,
                  ]}
                  onPress={() => handleChange("typeR", choice.value)}
                >
                  <Ionicons
                    name={choice.icon as any}
                    size={18}
                    color={active ? "#fff" : "#3366FF"}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={[ressourcesFormStyles.typeText, active && { color: "#fff" }]}>
                    {choice.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Lien */}
        <View style={ressourcesFormStyles.section}>
          <Text style={ressourcesFormStyles.label}>Lien *</Text>
          <TextInput
            style={ressourcesFormStyles.input}
            value={form.lienR}
            onChangeText={(v) => handleChange("lienR", v)}
            placeholder="https://exemple.com"
          />
        </View>

        {/* BOUTONS */}
        <View style={ressourcesFormStyles.buttonsRow}>
          <TouchableOpacity style={ressourcesFormStyles.saveButton} onPress={handleSave}>
            <Text style={ressourcesFormStyles.saveText}>
              {isEditing ? "Enregistrer" : "Créer"}
            </Text>
          </TouchableOpacity>
          {isEditing && (
            <TouchableOpacity style={ressourcesFormStyles.deleteButton} onPress={handleDelete}>
              <Text style={ressourcesFormStyles.deleteText}>Supprimer</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
