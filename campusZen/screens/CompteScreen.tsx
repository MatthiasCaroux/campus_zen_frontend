import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAPICurrentUser, getCurrentUser } from "../services/AuthService";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { COULEUR_FOND_BLEU, COULEUR_SOUS_TITRE, COULEUR_BOUTON, COULEUR_BOUTON_TEXTE } from '../src/theme/colors';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CompteScreen() {
  const { logout } = useContext(AuthContext);
  const user = getCurrentUser();

  if (user === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>L'utilisateur n'est pas connecté.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <View style={styles.card}>
          <Text style={styles.title}>Bonjour, {user.emailPers} !</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>ID :</Text>
            <Text style={styles.value}>{user.idPers}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Rôle :</Text>
            <Text style={styles.value}>{user.role}</Text>
          </View>
          {/* Ajouter d'autres infos ici si besoin */}
        </View>
      ) : (
        <Text style={styles.noUser}>Impossible de récupérer les informations.</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "75%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: COULEUR_FOND_BLEU,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: COULEUR_SOUS_TITRE,
    fontWeight: "500",
  },
  value: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: COULEUR_BOUTON,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: COULEUR_BOUTON_TEXTE,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COULEUR_FOND_BLEU,
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  noUser: {
    color: "#fff",
    fontSize: 16,
  },
});
