import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COULEUR_FOND_BLEU, COULEUR_SOUS_TITRE } from '../src/theme/colors';

export default function CompteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Compte</Text>
      <Text style={styles.subtitle}>Gérez votre profil</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COULEUR_FOND_BLEU,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COULEUR_SOUS_TITRE,
  },
});