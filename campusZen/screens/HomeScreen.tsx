import React, { useEffect, useState } from 'react';
import * as colors from "../src/theme/colors.js";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../src/context/LanguageContext';
import { getStoredUser, getStatuts } from '../services/AuthService';


export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [showConsultEtat, setShowConsultEtat] = useState(false);

  useEffect(() => {
    const checkStatut = async () => {
      try {
        const user = await getStoredUser();
        if (user && user.idPers) {
          const statuts = await getStatuts();
          const hasStatut = Array.isArray(statuts) && statuts.some((s) => s.personne === user.idPers);
          setShowConsultEtat(hasStatut);
        } else {
          setShowConsultEtat(false);
        }
      } catch {
        setShowConsultEtat(false);
      }
    };
    checkStatut();
  }, []);

  return (
    <LinearGradient
      colors={[colors.COULEUR_HEADER_BLEU, colors.COULEUR_FOND_BLEU_CLAIR]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section principale avec icône nuage et message */}
        <View style={styles.welcomeSection}>
          <View style={styles.cloudIcon}>
            <Ionicons name="cloud" size={80} color={colors.COULEUR_WHITE} />
            <Ionicons name="sunny" size={30} color={colors.COULEUR_SOLEIL} style={styles.sunIcon} />
          </View>

          <Text style={styles.appTitle}>CampusZen</Text>
          <Text style={styles.motivationalMessage}>
            {t('motivational_message')}
          </Text>
        </View>
        {/* Bouton Consulter mon état (affiché seulement si statut trouvé) */}
        {showConsultEtat && (
          <TouchableOpacity
            style={styles.consultButton}
            onPress={() => {
              navigation.navigate('ConsultEtat');
            }}
          >
            <Text style={styles.consultButtonText}>Consulter mon état</Text>
          </TouchableOpacity>
        )}
        {/* Section Ce soir */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('tonight')}</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Questionnaire')}>

            <Text style={styles.actionButtonText}>{t('evaluate_wellbeing')}</Text>
          </TouchableOpacity>
        </View>

        {/* Section Aujourd'hui */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('today')}</Text>

          <TouchableOpacity style={styles.videoButton}>
            <View style={styles.buttonContent}>
              <View style={styles.youtubeIcon}>
                <Ionicons name="logo-youtube" size={20} color={colors.COULEUR_WHITE} />
              </View>
              <Text style={styles.videoButtonText}>
                {t('watch_video')}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.podcastButton}>
            <View style={styles.buttonContent}>
              <View style={styles.youtubeIcon}>
                <Ionicons name="logo-youtube" size={20} color={colors.COULEUR_WHITE} />
              </View>
              <Text style={styles.podcastButtonText}>{t('listen_podcast')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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