import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#4A90E2', '#7BB3F0']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section principale avec icône nuage et message */}
        <View style={styles.welcomeSection}>
          <View style={styles.cloudIcon}>
            <Ionicons name="cloud" size={80} color="#ffffff" />
            <Ionicons name="sunny" size={30} color="#FFD700" style={styles.sunIcon} />
          </View>

          <Text style={styles.appTitle}>CampusZen</Text>
          <Text style={styles.motivationalMessage}>
            chaque jour est une nouvelle{'\n'}
            chance de prendre soin de toi.
          </Text>
        </View>

        {/* Bouton Consulter mon état */}
        <TouchableOpacity style={styles.consultButton}>
          <Text style={styles.consultButtonText}>Consulter mon état</Text>
        </TouchableOpacity>

        {/* Section Ce soir */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ce soir</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Évaluer mon bien-être</Text>
          </TouchableOpacity>
        </View>

        {/* Section Aujourd'hui */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Aujourd'hui</Text>

          <TouchableOpacity style={styles.videoButton}>
            <View style={styles.buttonContent}>
              <View style={styles.youtubeIcon}>
                <Ionicons name="logo-youtube" size={20} color="#ffffff" />
              </View>
              <Text style={styles.videoButtonText}>
                Voir une vidéo de 5 min sur{'\n'}le bien-être
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.podcastButton}>
            <View style={styles.buttonContent}>
              <View style={styles.youtubeIcon}>
                <Ionicons name="logo-youtube" size={20} color="#ffffff" />
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
    color: '#ffffff',
    marginBottom: 15,
  },
  motivationalMessage: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },
  consultButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 30,
    shadowColor: '#000',
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
    color: '#333',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
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
    color: '#333',
    textAlign: 'center',
  },
  videoButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  podcastButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
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
    backgroundColor: '#FF0000',
    borderRadius: 4,
    padding: 4,
    marginRight: 15,
  },
  videoButtonText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  podcastButtonText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
});