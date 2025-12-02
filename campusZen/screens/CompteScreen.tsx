import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getStoredUser } from "../services/AuthService";
import { compteStyles } from "../src/screenStyles/CompteStyle";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";

import { COULEUR_BOUTON } from '../src/theme/colors';

export default function CompteScreen() {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState<any>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getStoredUser();
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



