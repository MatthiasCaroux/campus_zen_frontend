import React, { useState, useContext } from "react";
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { login as apiLogin } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext";
import { loginRegisterStyle } from "../src/screenStyles/LoginRegisterStyle";
import { useTranslation } from "../src/context/LanguageContext";
import LanguageSelector from "../src/components/LanguageSelector";

export default function LoginScreen({ navigation }: any) {
  const [emailPers, setEmail] = useState("");
  const [passwordPers, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { login, setUser } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      const data = await apiLogin(emailPers, passwordPers);
      const user = { idPers: data.idPers, emailPers, role: data.role, lastConnection: data.lastConnection, endAccess: data.endAccess, endRefresh: data.endRefresh };
      await setUser(user);
      await login(data.access, data.refresh);
      setMessage("Connexion réussie ✅");
    } catch {
      setMessage("Erreur de connexion ❌");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={loginRegisterStyle.wrapper}>

        {/* Card container */}
        <View style={loginRegisterStyle.card}>

          <Image
            source={require('../assets/logo.png')}
            style={loginRegisterStyle.logo}
            resizeMode="contain"
          />

          <LanguageSelector />
          <Text style={loginRegisterStyle.title}>{t('login_title')}</Text>

          <TextInput
            placeholder={t('email_placeholder')}
            value={emailPers}
            onChangeText={setEmail}
            style={loginRegisterStyle.input}
          />

          <TextInput
            placeholder={t('password_placeholder')}
            value={passwordPers}
            onChangeText={setPassword}
            secureTextEntry
            style={loginRegisterStyle.input}
          />

          <TouchableOpacity style={loginRegisterStyle.button} onPress={handleLogin}>
            <Text style={loginRegisterStyle.buttonText}>{t('login_button')}</Text>
          </TouchableOpacity>

          {message ? <Text style={loginRegisterStyle.message}>{message}</Text> : null}

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={loginRegisterStyle.registerText}>
              {t('no_account')} <Text style={loginRegisterStyle.registerLink}>{t('register_link')}</Text>
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

