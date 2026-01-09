import React, { useState, useContext, useRef, useEffect } from "react";
import { View, TextInput, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { login as apiLogin } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext";
import { loginRegisterStyle } from "../src/screenStyles/LoginRegisterStyle";
import { useTranslation } from "../src/context/LanguageContext";
import LanguageSelector from "../src/components/LanguageSelector";
import { testApiConnection, API_BASE_URL } from "../config/axiosConfig";

export default function LoginScreen({ navigation }: any) {
  const [emailPers, setEmail] = useState("");
  const [passwordPers, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<View>(null);
  const passwordInputRef = useRef<View>(null);

  const { login, setUser } = useContext(AuthContext);
  const { t } = useTranslation();

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

  const handleLogin = async () => {
    try {
      const data = await apiLogin(emailPers, passwordPers);
      const user = { idPers: data.idPers, emailPers, role: data.role, lastConnection: data.lastConnection, endAccess: data.endAccess, endRefresh: data.endRefresh };
      await setUser(user);
      await login(data.access, data.refresh);
      setMessage("Connexion réussie ✅");
    } catch (error: any) {
      if (error?.response?.data?.detail?.[0]) {
        setMessage(error.response.data.detail[0] + " ❌");
      } else {
        setMessage("Erreur de connexion ❌");
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

          {/* Card container */}
          <View style={loginRegisterStyle.card}>

            <Image
              source={require('../assets/logo.png')}
              style={loginRegisterStyle.logo}
              resizeMode="contain"
            />

            <LanguageSelector />
            <Text style={loginRegisterStyle.title}>{t('login_title')}</Text>

            <View ref={emailInputRef}>
              <TextInput
                placeholder={t('email_placeholder')}
                value={emailPers}
                onChangeText={setEmail}
                onFocus={() => scrollToInput(emailInputRef)}
                style={loginRegisterStyle.input}
              />
            </View>

            <View ref={passwordInputRef}>
              <TextInput
                placeholder={t('password_placeholder')}
                value={passwordPers}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => scrollToInput(passwordInputRef)}
                style={loginRegisterStyle.input}
              />
            </View>

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

