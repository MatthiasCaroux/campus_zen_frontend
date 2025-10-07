import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { register } from "../services/AuthService";

export default function RegisterScreen({ navigation }: any) {
  const [emailPers, setEmail] = useState("");
  const [passwordPers, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      await register(emailPers, passwordPers);
      setMessage("Inscription réussie ✅");
      navigation.navigate("Login");
    } catch (error) {
      setMessage("Erreur lors de l’inscription ❌");
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="S’inscrire" onPress={handleRegister} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 },
});

