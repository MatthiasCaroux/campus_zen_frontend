import React, { useState } from 'react';
import * as colors from "../src/theme/colors.js";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';


export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [loadingQuestionnaire, setLoadingQuestionnaire] = useState(false);
  return (
    <LinearGradient
      colors={[colors.COULEUR_HEADER_BLEU, colors.COULEUR_FOND_BLEU_CLAIR]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section principale avec icône nuage et message */}
        <View style={styles.welcomeSection}>
          <View style={styles.cloudIcon}>
            <Ionicons name="cloud" size={80} color={colors.COULEUR_WHITE} />
            <Ionicons name="sunny" size={30} color={colors.COULEUR_SOLEIL} style={styles.sunIcon} />
          </View>

          <Text style={styles.appTitle}>CampusZen</Text>
          <Text style={styles.motivationalMessage}>
            chaque jour est une nouvelle{'\n'}
            chance de prendre soin de toi.
          </Text>
        </View>

        {/* Bouton Consulter mon état */}
        <TouchableOpacity
          style={styles.consultButton}
          onPress={() => {
            navigation.navigate('ConsultEtat');
          }}
        >
          <Text style={styles.consultButtonText}>Consulter mon état</Text>
        </TouchableOpacity>

        {/* Section Ce soir */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ce soir</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={async () => {
              try {
                setLoadingQuestionnaire(true);
                const response = await fetch('https://campuszenbackend-prod.up.railway.app/api/questionnaires');
                if (!response.ok) throw new Error('Erreur lors de la récupération des questionnaires');
                const data = await response.json();
                if (!Array.isArray(data) || data.length === 0) {
                  Alert.alert('Aucun questionnaire', "Aucun questionnaire n'est disponible pour le moment.");
                  return;
                }
                const randomIndex = Math.floor(Math.random() * data.length);
                const idQuestionnaire = data[randomIndex].idQuestionnaire ?? data[randomIndex].id ?? null;
                if (!idQuestionnaire) {
                  Alert.alert('Erreur', 'Identifiant du questionnaire introuvable.');
                  return;
                }
                navigation.navigate('Questions', { idQuestionnaire });
              } catch (err) {
                console.error(err);
                Alert.alert('Erreur', 'Impossible de lancer le questionnaire. Veuillez réessayer.');
              } finally {
                setLoadingQuestionnaire(false);
              }
            }}
          >
            {loadingQuestionnaire ? (
              <ActivityIndicator color={colors.COULEUR_HEADER_BLEU} />
            ) : (
              <Text style={styles.actionButtonText}>Évaluer mon bien-être</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Section Aujourd'hui */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Aujourd'hui</Text>

          <TouchableOpacity style={styles.videoButton}>
            <View style={styles.buttonContent}>
              <View style={styles.youtubeIcon}>
                <Ionicons name="logo-youtube" size={20} color={colors.COULEUR_WHITE} />
              </View>
              <Text style={styles.videoButtonText}>
                Voir une vidéo de 5 min sur{'\n'}le bien-être
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.podcastButton}>
            <View style={styles.buttonContent}>
              <View style={styles.youtubeIcon}>
                <Ionicons name="logo-youtube" size={20} color={colors.COULEUR_WHITE} />
              </View>
              <Text style={styles.podcastButtonText}>écouter un podcast</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  cloudIcon: {
    position: 'relative',
    alignItems: 'center',
    backgroundColor: colors.COULEUR_FOND_BLEU,
    justifyContent: 'center',
    marginBottom: 20,
  },
  sunIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  color: colors.COULEUR_WHITE,
    marginBottom: 15,
  },
  motivationalMessage: {
    fontSize: 16,
  color: colors.COULEUR_WHITE,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },
  consultButton: {
  backgroundColor: colors.COULEUR_WHITE,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 30,
  shadowColor: colors.COULEUR_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  consultButtonText: {
    fontSize: 16,
    fontWeight: '600',
  color: colors.COULEUR_TEXT_DARK,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  color: colors.COULEUR_WHITE,
    marginBottom: 15,
  },
  actionButton: {
  backgroundColor: colors.COULEUR_WHITE,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  shadowColor: colors.COULEUR_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  color: colors.COULEUR_TEXT_DARK,
    textAlign: 'center',
  },
  videoButton: {
  backgroundColor: colors.COULEUR_WHITE,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  shadowColor: colors.COULEUR_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  podcastButton: {
  backgroundColor: colors.COULEUR_WHITE,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
  shadowColor: colors.COULEUR_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  youtubeIcon: {
  backgroundColor: colors.COULEUR_YOUTUBE,
    borderRadius: 4,
    padding: 4,
    marginRight: 15,
  },
  videoButtonText: {
    fontSize: 15,
  color: colors.COULEUR_TEXT_DARK,
    fontWeight: '500',
    flex: 1,
  },
  podcastButtonText: {
    fontSize: 15,
    color: colors.COULEUR_TEXT_DARK,
    fontWeight: '500',
    flex: 1,
  },
});