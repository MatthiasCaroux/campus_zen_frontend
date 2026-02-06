import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { proFormStyles } from "../screenStyles/ProFormStyle";
import { createProfessionnel, deleteProfessionnel, getProfessionnelsById, updateProfessionnel } from "../services/ProfessionnelProvider";

type ProFormRouteProp = RouteProp<{ ProFormScreen: { proId?: number } }, "ProFormScreen">;

export default function ProFormScreen() {
  // formulaire creation ou edition d un pro
  const navigation = useNavigation();
  const route = useRoute<ProFormRouteProp>();
  const proId = route.params?.proId ?? null;

  const isEditing = !!proId;

  const [loading, setLoading] = useState<boolean>(true);
  const [form, setForm] = useState({
    nomPro: "",
    prenomPro: "",
    fonctionPro: "",
    telephonePro: "",
    emailPro: "",
    adressePro: "",
    lat: "",
    long: "",
  });

  useEffect(() => {
    async function fetchData() {
      if (!isEditing) {
        setLoading(false);
        return;
      }
      try {
        // si edition on precharge les champs
        const data = await getProfessionnelsById(proId!);
        setForm({
          nomPro: data.nomPro || "",
          prenomPro: data.prenomPro || "",
          fonctionPro: data.fonctionPro || "",
          telephonePro: data.telephonePro || "",
          emailPro: data.emailPro || "",
          adressePro: data.adressePro || "",
          lat: data.lat ? data.lat.toString() : "",
          long: data.long ? data.long.toString() : "",
        });
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      }
      setLoading(false);
    }
    fetchData();
  }, [proId]);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    // petites validations avant envoi
    if (!form.nomPro.trim() || !form.prenomPro.trim() || !form.fonctionPro.trim() || 
        !form.telephonePro.trim() || !form.emailPro.trim() || !form.adressePro.trim() ||
        !form.lat.trim() || !form.long.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (form.emailPro && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailPro)) {
      Alert.alert("Erreur", "L'email doit être une adresse valide.");
      return;
    }

    const dataToSend: any = {
      // conversion lat long en nombres
      nomPro: form.nomPro.trim(),
      prenomPro: form.prenomPro.trim(),
      fonctionPro: form.fonctionPro.trim(),
      telephonePro: form.telephonePro.trim(),
      emailPro: form.emailPro.trim(),
      adressePro: form.adressePro.trim(),
      lat: parseFloat(form.lat),
      long: parseFloat(form.long),
    };

    try {
      if (isEditing) {
        await updateProfessionnel(proId!, dataToSend);
        Alert.alert("Succès", "Professionnel mis à jour !");
      } else {
        await createProfessionnel(dataToSend);
        Alert.alert("Succès", "Professionnel créé !");
      }
      navigation.goBack();
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data) {
        Alert.alert("Erreur", "Impossible d'enregistrer le professionnel: " + err.response.data[Object.keys(err.response.data)[0]]);
      } else {
        Alert.alert("Erreur", "Impossible d'enregistrer le professionnel");
      }
    }
  };

  const handleDelete = () => {
    // confirmation avant suppression
    Alert.alert(
      "Supprimer",
      "Voulez-vous vraiment supprimer ce professionnel ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await deleteProfessionnel(proId!);
            Alert.alert("Supprimé", "Le professionnel a été supprimé.");
            navigation.goBack();
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={proFormStyles.loadingContainer}>
        <Text style={proFormStyles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={proFormStyles.container}>
      
      {/* HEADER */}
      <View style={proFormStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={proFormStyles.headerTitle}>
          {isEditing ? "Modifier le professionnel" : "Créer un professionnel"}
        </Text>
      </View>

      <ScrollView style={proFormStyles.scrollView} contentContainerStyle={proFormStyles.scrollContent}>

        {/* Nom et Prénom */}
        <View style={proFormStyles.section}>
          <Text style={proFormStyles.label}>Identité *</Text>
          <View style={proFormStyles.nameRow}>
            <View style={proFormStyles.nameInput}>
              <Text style={proFormStyles.nameLabel}>Nom</Text>
              <TextInput
                style={proFormStyles.input}
                value={form.nomPro}
                onChangeText={(v) => handleChange("nomPro", v)}
                placeholder="Nom"
              />
            </View>
            <View style={proFormStyles.nameInput}>
              <Text style={proFormStyles.nameLabel}>Prénom</Text>
              <TextInput
                style={proFormStyles.input}
                value={form.prenomPro}
                onChangeText={(v) => handleChange("prenomPro", v)}
                placeholder="Prénom"
              />
            </View>
          </View>
        </View>

        {/* Fonction */}
        <View style={proFormStyles.section}>
          <Text style={proFormStyles.label}>Fonction *</Text>
          <TextInput
            style={proFormStyles.input}
            value={form.fonctionPro}
            onChangeText={(v) => handleChange("fonctionPro", v)}
            placeholder="Ex: Psychologue, Psychiatre, Médecin..."
          />
        </View>

        {/* Téléphone */}
        <View style={proFormStyles.section}>
          <Text style={proFormStyles.label}>Téléphone *</Text>
          <TextInput
            style={proFormStyles.input}
            value={form.telephonePro}
            onChangeText={(v) => handleChange("telephonePro", v)}
            placeholder="06 12 34 56 78"
            keyboardType="phone-pad"
          />
        </View>

        {/* Email */}
        <View style={proFormStyles.section}>
          <Text style={proFormStyles.label}>Email *</Text>
          <TextInput
            style={proFormStyles.input}
            value={form.emailPro}
            onChangeText={(v) => handleChange("emailPro", v)}
            placeholder="exemple@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Adresse */}
        <View style={proFormStyles.section}>
          <Text style={proFormStyles.label}>Adresse *</Text>
          <TextInput
            style={[proFormStyles.input, proFormStyles.textarea]}
            multiline
            value={form.adressePro}
            onChangeText={(v) => handleChange("adressePro", v)}
            placeholder="Adresse complète du professionnel"
          />
        </View>

        {/* Coordonnées GPS */}
        <View style={proFormStyles.section}>
          <Text style={proFormStyles.label}>Coordonnées GPS *</Text>
          <View style={proFormStyles.gpsRow}>
            <View style={proFormStyles.gpsInput}>
              <Text style={proFormStyles.gpsLabel}>Latitude</Text>
              <TextInput
                style={proFormStyles.input}
                value={form.lat}
                onChangeText={(v) => handleChange("lat", v)}
                placeholder="48.8566"
                keyboardType="numeric"
              />
            </View>
            <View style={proFormStyles.gpsInput}>
              <Text style={proFormStyles.gpsLabel}>Longitude</Text>
              <TextInput
                style={proFormStyles.input}
                value={form.long}
                onChangeText={(v) => handleChange("long", v)}
                placeholder="2.3522"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* BOUTONS */}
        <View style={proFormStyles.buttonsRow}>
          <TouchableOpacity style={proFormStyles.saveButton} onPress={handleSave}>
            <Text style={proFormStyles.saveText}>
              {isEditing ? "Enregistrer" : "Créer"}
            </Text>
          </TouchableOpacity>
          {isEditing && (
            <TouchableOpacity style={proFormStyles.deleteButton} onPress={handleDelete}>
              <Text style={proFormStyles.deleteText}>Supprimer</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}