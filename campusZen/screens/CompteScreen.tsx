import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { View, Text, StyleSheet, Button } from 'react-native';
import { COULEUR_FOND_BLEU, COULEUR_SOUS_TITRE } from '../src/theme/colors';

export default function CompteScreen() {
  const { logout } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Se déconnecter" onPress={logout} />
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

