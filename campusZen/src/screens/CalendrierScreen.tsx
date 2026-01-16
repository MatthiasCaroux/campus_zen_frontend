import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Colors from '../theme/colors';
const { COULEUR_FOND_BLEU, COULEUR_SOUS_TITRE } = Colors;

export default function CalendrierScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendrier</Text>
      <Text style={styles.subtitle}>Gérez votre emploi du temps</Text>
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