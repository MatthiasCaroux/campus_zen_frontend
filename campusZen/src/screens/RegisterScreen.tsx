<<<<<<< HEAD:campusZen/screens/RegisterScreen.tsx
import React, { useState, useRef } from "react";
import { View, TextInput, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { register as apiRegister } from "../services/AuthService";
import { loginRegisterStyle } from "../src/screenStyles/LoginRegisterStyle";
import { useTranslation } from "../src/context/LanguageContext";
import LanguageSelector from "../src/components/LanguageSelector";

export default function RegisterScreen({ navigation }: any) {
  const [emailPers, setEmail] = useState("");
  const [passwordPers, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<View>(null);
  const passwordInputRef = useRef<View>(null);
  const confirmPasswordInputRef = useRef<View>(null);

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

  const handleRegister = async () => {
    if (passwordPers !== confirmPassword) {
      setMessage(t('passwords_not_match'));
      return;
    }

    try {
      await apiRegister(emailPers, passwordPers);
      setMessage(t('register_success'));
      setTimeout(() => navigation.navigate("Login"), 1500);
    } catch (error) {
      if (typeof error === "object" && error !== null && "status" in error && (error as any).status === 400) {
        setMessage(t('email_already_used'));
      } else {
        setMessage(t('register_error'));
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
            <Text style={loginRegisterStyle.title}>{t('register_title')}</Text>
            <Text style={loginRegisterStyle.subtitle}>{t('register_subtitle')}</Text>

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
            <Text style={loginRegisterStyle.label}>{t('password_label')}</Text>
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

            {/* Confirm Password field */}
            <Text style={loginRegisterStyle.label}>{t('confirm_password_label')}</Text>
            <View ref={confirmPasswordInputRef} style={loginRegisterStyle.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={loginRegisterStyle.inputIcon} />
              <TextInput
                placeholder={t('confirm_password_placeholder')}
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                onFocus={() => scrollToInput(confirmPasswordInputRef)}
                style={loginRegisterStyle.input}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={loginRegisterStyle.eyeIcon}>
                <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Register button */}
            <TouchableOpacity style={loginRegisterStyle.button} onPress={handleRegister}>
              <Text style={loginRegisterStyle.buttonText}>{t('register_button')}</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>

            {message ? <Text style={loginRegisterStyle.message}>{message}</Text> : null}

            {/* Login link */}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={loginRegisterStyle.registerText}>
                {t('has_account')} <Text style={loginRegisterStyle.registerLink}>{t('login_link')}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
=======
import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { register as apiRegister } from "../services/AuthService";
import { loginRegisterStyle } from "../screenStyles/LoginRegisterStyle";

export default function RegisterScreen({ navigation }: any) {
  // ecran d inscription
  const [emailPers, setEmail] = useState("");
  const [passwordPers, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<View>(null);
  const passwordInputRef = useRef<View>(null);
  const confirmPasswordInputRef = useRef<View>(null);

  const scrollToInput = (inputRef: React.RefObject<View>) => {
    // meme idee que login on scroll sur le champ focus
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
    // verif simple avant appel api
    if (passwordPers !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await apiRegister(emailPers, passwordPers);
      setMessage("✅ Inscription réussie !");
      // redirection auto apres un court delai
      setTimeout(() => navigation.navigate("Login"), 1500);
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

>>>>>>> 52ae23e41c04ff897017e98d47ad1487547f8434:campusZen/src/screens/RegisterScreen.tsx
