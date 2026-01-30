<<<<<<< HEAD:campusZen/screens/LoginScreen.tsx
import React, { useState, useContext, useRef } from "react";
import { View, TextInput, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { login as apiLogin } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext";
import { loginRegisterStyle } from "../src/screenStyles/LoginRegisterStyle";
import { useTranslation } from "../src/context/LanguageContext";
import LanguageSelector from "../src/components/LanguageSelector";

export default function LoginScreen({ navigation }: any) {
  const [emailPers, setEmail] = useState("");
  const [passwordPers, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      setMessage("Connexion réussie");
    } catch (error: any) {
      if (error?.response?.data?.detail?.[0]) {
        setMessage(error.response.data.detail[0]);
      } else {
        setMessage("Erreur de connexion");
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
          {/* Header */}
          <View style={loginRegisterStyle.header}>
            <View style={loginRegisterStyle.headerLogoContainer}>
              <Image
                source={require('../assets/logo.png')}
                style={loginRegisterStyle.headerLogo}
                resizeMode="contain"
              />
              <Text style={loginRegisterStyle.headerTitle}>CampusZen</Text>
            </View>
            <LanguageSelector compact />
          </View>

          {/* Card container */}
          <View style={loginRegisterStyle.card}>
            {/* Mascot with sparkles */}
            <View style={loginRegisterStyle.mascotContainer}>
              <Text style={[loginRegisterStyle.sparkle, loginRegisterStyle.sparkleTop]}>✦</Text>
              <Image
                source={require('../assets/logo.png')}
                style={loginRegisterStyle.mascotImage}
                resizeMode="contain"
              />
              <Text style={[loginRegisterStyle.sparkle, loginRegisterStyle.sparkleLeft]}>☁</Text>
            </View>

            {/* Title & Subtitle */}
            <Text style={loginRegisterStyle.title}>{t('login_title')}</Text>
            <Text style={loginRegisterStyle.subtitle}>{t('login_subtitle')}</Text>

            {/* Email field */}
            <Text style={loginRegisterStyle.label}>{t('email_label')}</Text>
            <View ref={emailInputRef} style={loginRegisterStyle.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#999" style={loginRegisterStyle.inputIcon} />
              <TextInput
                placeholder={t('email_placeholder')}
                placeholderTextColor="#999"
                value={emailPers}
                onChangeText={setEmail}
                onFocus={() => scrollToInput(emailInputRef)}
                style={loginRegisterStyle.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password field */}
            <View style={loginRegisterStyle.passwordHeader}>
              <Text style={loginRegisterStyle.label}>{t('password_label')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                <Text style={loginRegisterStyle.forgotPassword}>{t('forgot_password')}</Text>
              </TouchableOpacity>
            </View>
            <View ref={passwordInputRef} style={loginRegisterStyle.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={loginRegisterStyle.inputIcon} />
              <TextInput
                placeholder={t('password_placeholder')}
                placeholderTextColor="#999"
                value={passwordPers}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => scrollToInput(passwordInputRef)}
                style={loginRegisterStyle.input}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={loginRegisterStyle.eyeIcon}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Login button */}
            <TouchableOpacity style={loginRegisterStyle.button} onPress={handleLogin}>
              <Text style={loginRegisterStyle.buttonText}>{t('login_button')}</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>

            {message ? <Text style={loginRegisterStyle.message}>{message}</Text> : null}

            {/* Register link */}
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
=======
import React, { useState, useContext, useRef, useEffect } from "react";
import { View, TextInput, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { login as apiLogin } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext";
import { loginRegisterStyle } from "../screenStyles/LoginRegisterStyle";
import { useTranslation } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";

export default function LoginScreen({ navigation }: any) {
  // ecran de connexion
  const [emailPers, setEmail] = useState("");
  const [passwordPers, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<View>(null);
  const passwordInputRef = useRef<View>(null);

  const { login, setUser } = useContext(AuthContext);
  const { t } = useTranslation();

  const scrollToInput = (inputRef: React.RefObject<View>) => {
    // petit scroll auto pour que le champ reste visible quand le clavier s ouvre
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
      // appel api puis stockage du user et des tokens
      const data = await apiLogin(emailPers, passwordPers);
      const user = { idPers: data.idPers, emailPers, role: data.role, lastConnection: data.lastConnection, endAccess: data.endAccess, endRefresh: data.endRefresh };
      await setUser(user);
      await login(data.access, data.refresh);
      setMessage("Connexion réussie ✅");
    } catch (error: any) {
      // on essaye d afficher un message propre si l api renvoie un detail
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

>>>>>>> 52ae23e41c04ff897017e98d47ad1487547f8434:campusZen/src/screens/LoginScreen.tsx
