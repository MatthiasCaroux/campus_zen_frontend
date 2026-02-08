import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getStoredUser } from "../services/AuthService";
import { compteStyles } from "../screenStyles/CompteStyle";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView, Platform, StatusBar } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import * as colors from '../theme/colors';
import { useTranslation } from "../context/LanguageContext";

import LanguageSelector from "../components/LanguageSelector";

export default function CompteScreen() {
  // ecran compte infos user + langue + logout
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // on recupere le user stocke localement
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
      <LinearGradient
        colors={[colors.COULEUR_HEADER_BLEU, colors.COULEUR_FOND_BLEU_CLAIR]}
        style={compteStyles.loadingContainer}
      >
        <SafeAreaView style={compteStyles.safeArea}>
          <ActivityIndicator size="large" color={colors.COULEUR_WHITE} />
          <Text style={compteStyles.loadingText}>Chargement des informations...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!user) {
    return (
      <LinearGradient
        colors={[colors.COULEUR_HEADER_BLEU, colors.COULEUR_FOND_BLEU_CLAIR]}
        style={compteStyles.loadingContainer}
      >
        <SafeAreaView style={compteStyles.safeArea}>
          <Text style={compteStyles.noUser}>Utilisateur non connecté.</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.COULEUR_HEADER_BLEU, colors.COULEUR_FOND_BLEU_CLAIR]}
      style={compteStyles.gradientContainer}
    >
      <SafeAreaView style={compteStyles.safeArea}>
        <TouchableOpacity 
          style={compteStyles.floatingAboutButton} 
          onPress={() => navigation.navigate('About')}
        >
          <Ionicons name="information-circle" size={28} color={colors.COULEUR_WHITE} />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={compteStyles.container}>
        {/* section profil */}
        <View style={compteStyles.profileSection}>
          <View style={compteStyles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color={colors.COULEUR_WHITE} />
          </View>
          <Text style={compteStyles.welcomeText}>{t('hello')} !</Text>
          <View style={compteStyles.emailPill}>
            <Text style={compteStyles.emailText}>{user.login}</Text>
          </View>
        </View>

        {/* carte infos */}
        <View style={compteStyles.card}>
          <Text style={compteStyles.cardTitle}>Mes informations</Text>

          <View style={compteStyles.infoRow}>
            <View style={compteStyles.infoIconContainer}>
              <Ionicons name="id-card-outline" size={24} color={colors.COULEUR_HEADER_BLEU} />
            </View>
            <View style={compteStyles.infoContent}>
              <Text style={compteStyles.label}>ID</Text>
              <Text style={compteStyles.value}>{user.idPers}</Text>
            </View>
          </View>

          <View style={compteStyles.separator} />

          <View style={compteStyles.infoRow}>
            <View style={compteStyles.infoIconContainer}>
              <Ionicons name="shield-checkmark-outline" size={24} color={colors.COULEUR_HEADER_BLEU} />
            </View>
            <View style={compteStyles.infoContent}>
              <Text style={compteStyles.label}>Rôle</Text>
              <Text style={compteStyles.value}>{user.role}</Text>
            </View>
          </View>
        </View>

        {/* carte langue */}
        <View style={compteStyles.card}>
          <Text style={compteStyles.cardTitle}>Langue</Text>
          <LanguageSelector />
        </View>

        {/* bouton deconnexion */}
        <TouchableOpacity style={compteStyles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={colors.COULEUR_WHITE} style={{ marginRight: 8 }} />
          <Text style={compteStyles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}



