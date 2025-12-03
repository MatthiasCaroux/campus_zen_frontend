import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { register as apiRegister } from "../services/AuthService";
import { loginRegisterStyle } from "../src/screenStyles/LoginRegisterStyle";

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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={loginRegisterStyle.wrapper}>
        
        {/* CARD */}
        <View style={loginRegisterStyle.card}>
          
          <Image 
            source={require('../assets/logo.png')}
            style={loginRegisterStyle.logo}
            resizeMode="contain"
          />

          <Text style={loginRegisterStyle.title}>Créer un compte</Text>

          <TextInput
            placeholder="Email"
            value={emailPers}
            autoCapitalize="none"
            onChangeText={setEmail}
            style={loginRegisterStyle.input}
          />

          <TextInput
            placeholder="Mot de passe"
            value={passwordPers}
            onChangeText={setPassword}
            secureTextEntry
            style={loginRegisterStyle.input}
          />

          <TextInput
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={loginRegisterStyle.input}
          />

          <TouchableOpacity style={loginRegisterStyle.button} onPress={handleRegister}>
            <Text style={loginRegisterStyle.buttonText}>S’inscrire</Text>
          </TouchableOpacity>

          {message ? <Text style={loginRegisterStyle.message}>{message}</Text> : null}

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={loginRegisterStyle.registerText}>
              Déjà un compte ? <Text style={loginRegisterStyle.registerLink}>Se connecter</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

