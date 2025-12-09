import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { register as apiRegister } from "../services/AuthService";

export default function RegisterScreen({ navigation }: any) {
  const [emailPers, setEmail] = useState("");
  const [passwordPers, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (passwordPers !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await apiRegister(emailPers, passwordPers);
      setMessage("✅ Inscription réussie !");
      setTimeout(() => navigation.navigate("Login"), 1500); // Redirection auto après 1,5s
    } catch (error) {
      if (typeof error === "object" && error !== null && "status" in error && (error as any).status === 400) {
        setMessage("❌ Email déjà utilisé");
      } else {
        setMessage("Erreur lors de l’inscription ❌");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        placeholder="Email"
        value={emailPers}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Mot de passe"
        value={passwordPers}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="S’inscrire" onPress={handleRegister} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 20,
    marginHorizontal: 50,
    marginVertical: 140,
    backgroundColor: '#fff9e8',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5 
  },
  input: { 
    borderWidth: 1, 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 10, 
    borderColor: '#ccc' 
  },
  logo: { width: 100, height: 100, alignSelf: 'center' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  message: { textAlign: 'center', marginTop: 10 },
  registerText: { textAlign: 'center', marginTop: 20, fontSize: 14 },
  registerLink: { color: '#007AFF', fontWeight: 'bold' },
});

