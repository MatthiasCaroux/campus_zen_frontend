import React, { useState, useContext, useRef, useEffect } from "react";
import { View, TextInput, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as colors from "../theme/colors.js";
import { login as apiLogin } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext";
import { loginRegisterStyle } from "../screenStyles/LoginRegisterStyle";
import { useTranslation } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";
import AnimatedSparkle from "../components/AnimatedSparkle";
import AnimatedButton from "../components/AnimatedButton";

export default function LoginScreen({ navigation }: any) {
  const [emailPers, setEmail] = useState("");
  const [passwordPers, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<View>(null);
  const passwordInputRef = useRef<View>(null);

  // Animations d'entrée
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(30)).current;

  const { login, setUser } = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    // Animation du logo
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation du formulaire avec délai
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(formTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);
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
    <LinearGradient
      colors={[colors.COULEUR_HEADER_BLEU, colors.COULEUR_FOND_BLEU_CLAIR]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "transparent" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={loginRegisterStyle.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[loginRegisterStyle.wrapper, { backgroundColor: "transparent" }]}>
          {/* Header with language selector */}
          <View style={loginRegisterStyle.header}>
            <View />
            <LanguageSelector compact />
          </View>

          {/* Logo section - centered */}
          <Animated.View style={[loginRegisterStyle.logoSection, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
            <View style={loginRegisterStyle.mascotContainer}>
              <AnimatedSparkle style={loginRegisterStyle.sparkleTop} />
              <Image
                source={require('../assets/logo.png')}
                style={loginRegisterStyle.mascotImage}
                resizeMode="contain"
              />
            </View>
            <Text style={loginRegisterStyle.title}>{t('login_title')}</Text>
            <Text style={loginRegisterStyle.subtitle}>{t('login_subtitle')}</Text>
          </Animated.View>

          {/* Form section - bottom */}
          <Animated.View style={[loginRegisterStyle.formSection, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>
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
            <AnimatedButton style={loginRegisterStyle.button} onPress={handleLogin}>
              <Text style={loginRegisterStyle.buttonText}>{t('login_button')}</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </AnimatedButton>

            {message ? <Text style={loginRegisterStyle.message}>{message}</Text> : null}

            {/* Register link */}
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={loginRegisterStyle.registerText}>
                {t('no_account')} <Text style={loginRegisterStyle.registerLink}>{t('register_link')}</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
