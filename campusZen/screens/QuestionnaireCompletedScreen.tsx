import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as colors from "../src/theme/colors.js";

export default function QuestionnaireCompletedScreen() {
  const navigation = useNavigation();

  const handleReturnHome = () => {
    navigation.navigate('HomeMain' as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Icône de succès */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={120} color={colors.COULEUR_HEADER_BLEU} />
        </View>

        {/* Message de confirmation */}
        <Text style={styles.title}>Questionnaire terminé !</Text>
        <Text style={styles.message}>
          Merci d'avoir répondu à ce questionnaire. Vos réponses ont bien été enregistrées.
        </Text>

        {/* Bouton retour */}
        <TouchableOpacity style={styles.button} onPress={handleReturnHome}>
          <Text style={styles.buttonText}>Retour à l'accueil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.COULEUR_FOND_BLEU_CLAIR,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.COULEUR_TEXT_DARK,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.COULEUR_TEXT_DARK,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    opacity: 0.8,
  },
  button: {
    backgroundColor: colors.COULEUR_HEADER_BLEU,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
    shadowColor: colors.COULEUR_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: colors.COULEUR_WHITE,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
