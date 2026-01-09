import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { register as apiRegister } from "../services/AuthService";
import { loginRegisterStyle } from "../src/screenStyles/LoginRegisterStyle";
import { testApiConnection, API_BASE_URL } from "../config/axiosConfig";

export default function RegisterScreen({ navigation }: any) {
  const [emailPers, setEmail] = useState("");
  const [passwordPers, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "error">("checking");
  const [apiDetails, setApiDetails] = useState<string>("");

  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<View>(null);
  const passwordInputRef = useRef<View>(null);
  const confirmPasswordInputRef = useRef<View>(null);

  useEffect(() => {
    const checkApiConnection = async () => {
      const result = await testApiConnection();
      if (result.success) {
        setApiStatus("connected");
        setApiDetails("Connexion réussie");
      } else {
        setApiStatus("error");
        setApiDetails(result.details || result.error || "Erreur inconnue");
      }
    };
    checkApiConnection();
  }, []);

  const scrollToInput = (inputRef: React.RefObject<View>) => {
    setTimeout(() => {
      inputRef.current?.measureLayout(
        scrollViewRef.current as any,
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
        },
        () => {}
      );
    }, 100);
  };

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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={loginRegisterStyle.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={loginRegisterStyle.wrapper}>

          {/* CARD */}
          <View style={loginRegisterStyle.card}>

            <Image
              source={require('../assets/logo.png')}
              style={loginRegisterStyle.logo}
              resizeMode="contain"
            />

            <View style={loginRegisterStyle.apiStatusContainer}>
              <View style={[
                loginRegisterStyle.apiStatusIndicator,
                apiStatus === "connected" && loginRegisterStyle.apiStatusConnected,
                apiStatus === "error" && loginRegisterStyle.apiStatusError,
                apiStatus === "checking" && loginRegisterStyle.apiStatusChecking
              ]} />
              <View style={loginRegisterStyle.apiStatusTextContainer}>
                <Text style={loginRegisterStyle.apiStatusText}>
                  {apiStatus === "checking" && "Vérification de l'API..."}
                  {apiStatus === "connected" && "API connectée"}
                  {apiStatus === "error" && "API non accessible"}
                </Text>
                <Text style={loginRegisterStyle.apiUrlText}>{API_BASE_URL}</Text>
                {apiDetails && apiStatus !== "checking" && (
                  <Text style={loginRegisterStyle.apiDetailsText}>{apiDetails}</Text>
                )}
              </View>
            </View>

            <Text style={loginRegisterStyle.title}>Créer un compte</Text>

            <View ref={emailInputRef}>
              <TextInput
                placeholder="Email"
                value={emailPers}
                autoCapitalize="none"
                onChangeText={setEmail}
                onFocus={() => scrollToInput(emailInputRef)}
                style={loginRegisterStyle.input}
              />
            </View>

            <View ref={passwordInputRef}>
              <TextInput
                placeholder="Mot de passe"
                value={passwordPers}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => scrollToInput(passwordInputRef)}
                style={loginRegisterStyle.input}
              />
            </View>

            <View ref={confirmPasswordInputRef}>
              <TextInput
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                onFocus={() => scrollToInput(confirmPasswordInputRef)}
                style={loginRegisterStyle.input}
              />
            </View>

            <TouchableOpacity style={loginRegisterStyle.button} onPress={handleRegister}>
              <Text style={loginRegisterStyle.buttonText}>S'inscrire</Text>
            </TouchableOpacity>

            {message ? <Text style={loginRegisterStyle.message}>{message}</Text> : null}

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={loginRegisterStyle.registerText}>
                Déjà un compte ? <Text style={loginRegisterStyle.registerLink}>Se connecter</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

