import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getCurrentUser } from "../services/AuthService";
import { compteStyles } from "../src/screenStyles/CompteStyle";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Platform } from "react-native";
import { COULEUR_FOND_BLEU, COULEUR_SOUS_TITRE, COULEUR_BOUTON, COULEUR_BOUTON_TEXTE } from '../src/theme/colors';

export default function CompteScreen() {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState<any>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        if (data) {
          setUser(data);
        }
      } catch (error) {
        console.error("Erreur récupération utilisateur", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={compteStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COULEUR_BOUTON} />
        <Text style={compteStyles.loadingText}>Chargement des informations...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={compteStyles.loadingContainer}>
        <Text style={compteStyles.noUser}>Utilisateur non connecté.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={compteStyles.container}>
      <View style={compteStyles.card}>
        <Text style={compteStyles.title}>Bonjour, {user.emailPers} !</Text>

        <View style={compteStyles.infoRow}>
          <Text style={compteStyles.label}>ID :</Text>
          <Text style={compteStyles.value}>{user.idPers}</Text>
        </View>

        <View style={compteStyles.infoRow}>
          <Text style={compteStyles.label}>Rôle :</Text>
          <Text style={compteStyles.value}>{user.role}</Text>
        </View>

        {/* Ajouter d'autres infos ici si besoin */}
      </View>

      <TouchableOpacity style={compteStyles.logoutButton} onPress={logout}>
        <Text style={compteStyles.logoutButtonText}>Se déconnecter</Text>
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
    backgroundColor: "#ffffff",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    padding: 25,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
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
    marginBottom: 12,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    color: COULEUR_SOUS_TITRE,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: COULEUR_BOUTON,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
    backgroundColor: "#ffffff",
    padding: 20,
  },
  loadingText: {
    color: "#333",
    marginTop: 10,
    fontSize: 16,
  },
  noUser: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
  },
});

