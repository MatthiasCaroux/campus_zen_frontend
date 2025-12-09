import React, { useState, useContext } from "react";
import { View, TextInput, Button, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { login as apiLogin } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }: any) {
  const [emailPers, setEmail] = useState("");
  const [passwordPers, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login, setUser } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const data = await apiLogin(emailPers, passwordPers);
      const user = {idPers : data.idPers, emailPers: emailPers, role: data.role};
      await setUser(user); 
      await login(data.access, data.refresh); // ✅ Met à jour le contexte global
      setMessage("Connexion réussie ✅");
    } catch (error) {
      setMessage("Erreur de connexion ❌");
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <Image 
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Se Connecter</Text>
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
        <Button title="Se connecter" onPress={handleLogin} />
        {message ? <Text>{message}</Text> : null}
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>
            Pas encore de compte ? <Text style={styles.registerLink}>S’inscrire</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 20,
    marginHorizontal: 50,
    marginVertical: 160,
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

