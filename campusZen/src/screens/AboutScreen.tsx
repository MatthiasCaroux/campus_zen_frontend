import React from "react";
import { View, Text, ScrollView, SafeAreaView, Platform, StatusBar, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { aboutStyles } from "../screenStyles/AboutStyle";
import * as colors from '../theme/colors';
import { useTranslation } from "../context/LanguageContext";

export default function AboutScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={[colors.COULEUR_HEADER_BLEU, colors.COULEUR_FOND_BLEU_CLAIR]}
      style={aboutStyles.gradientContainer}
    >
      <SafeAreaView style={aboutStyles.safeArea}>
        <ScrollView contentContainerStyle={aboutStyles.container}>
          {/* Header avec bouton retour */}
          <View style={aboutStyles.header}>
            <TouchableOpacity 
              style={aboutStyles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.COULEUR_WHITE} />
            </TouchableOpacity>
            <Text style={aboutStyles.headerTitle}>À propos</Text>
          </View>

          {/* Section Héro */}
          <View style={aboutStyles.heroSection}>
            <Text style={aboutStyles.appTitle}>CampusZen</Text>
            <Text style={aboutStyles.appSubtitle}>Une application pour la santé mentale des étudiants</Text>
          </View>

          {/* Section Contexte avec Icône */}
          <View style={aboutStyles.section}>
            <View style={aboutStyles.sectionWithIcon}>
              <View style={aboutStyles.sectionIconContainer}>
                <Ionicons name="bulb-outline" size={28} color={colors.COULEUR_HEADER_BLEU} />
              </View>
              <Text style={aboutStyles.sectionTitle}>Contexte et Objectif</Text>
            </View>
            <Text style={aboutStyles.sectionText}>
              Campus Zen s'inscrit dans le cadre du projet <Text style={aboutStyles.highlightText}>Mama_Africa</Text> pour la santé mentale des étudiants. L'application offre un outil de suivi de l'état émotionnel sous forme de "météo émotionnelle" et propose des ressources adaptées aux contextes socio-économiques et culturels.
            </Text>
          </View>

          {/* Section Équipe de Développement avec Icône */}
          <View style={aboutStyles.section}>
            <View style={aboutStyles.sectionWithIcon}>
              <View style={aboutStyles.sectionIconContainer}>
                <Ionicons name="people-outline" size={28} color={colors.COULEUR_HEADER_BLEU} />
              </View>
              <Text style={aboutStyles.sectionTitle}>Équipe de Développement</Text>
            </View>
            <Text style={aboutStyles.authorsList}>
              <Text style={aboutStyles.authorBullet}>👤</Text>Enzo Familiar-Marais{'\n'}
              <Text style={aboutStyles.authorBullet}>👤</Text>Matthias Caroux{'\n'}
              <Text style={aboutStyles.authorBullet}>👤</Text>Niksan Nagarajah{'\n'}
              <Text style={aboutStyles.authorBullet}>👤</Text>Samuel Niveau
            </Text>
          </View>

          {/* Section À propos avec Icône et Logos */}
          <View style={aboutStyles.section}>
            <View style={aboutStyles.sectionWithIcon}>
              <View style={aboutStyles.sectionIconContainer}>
                <Ionicons name="information-circle-outline" size={28} color={colors.COULEUR_HEADER_BLEU} />
              </View>
              <Text style={aboutStyles.sectionTitle}>À propos</Text>
            </View>
            <Text style={aboutStyles.sectionText}>
              Cette application a été développée par des étudiants en 3ᵉ année de BUT Informatique à l'<Text style={aboutStyles.highlightText}>IUT d'Orléans</Text>, en partenariat avec le projet <Text style={aboutStyles.highlightText}>Mama Africa</Text> et l'<Text style={aboutStyles.highlightText}>IRD</Text>.
            </Text>
            <View style={aboutStyles.logosContainer}>
              <View style={aboutStyles.logoWrapper}>
                <Image
                  source={require('../assets/logo-iut-orleans.jpg')}
                  style={aboutStyles.logo}
                />
              </View>
              <View style={aboutStyles.logoWrapper}>
                <Image
                  source={require('../assets/Logo_IRD.png')}
                  style={aboutStyles.logo}
                />
              </View>
            </View>
          </View>


        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
