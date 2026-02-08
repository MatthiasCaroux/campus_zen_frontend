import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { register as apiRegister } from "../services/AuthService";
import { loginRegisterStyle } from "../screenStyles/LoginRegisterStyle";
import { useTranslation } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";
import AnimatedSparkle from "../components/AnimatedSparkle";
import AnimatedButton from "../components/AnimatedButton";

export default function RegisterScreen({ navigation }: any) {
  const [login, setLogin] = useState("");
  const [passwordPers, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<View>(null);
  const passwordInputRef = useRef<View>(null);
  const confirmPasswordInputRef = useRef<View>(null);

  // Animations d'entrée
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(30)).current;

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

  const handleRegister = async () => {
    if (passwordPers !== confirmPassword) {
      setMessage(t('passwords_not_match'));
      return;
    }

    try {
      await apiRegister(login, passwordPers);
      setMessage(t('register_success'));
      setTimeout(() => navigation.navigate("Login"), 1500);
    } catch (error) {
      if (typeof error === "object" && error !== null && "status" in error && (error as any).status === 400) {
        setMessage(t('login_already_used'));
      } else {
        setMessage(t('register_error'));
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FAFAFA" }}
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
          {/* Header with language selector */}
          <View style={loginRegisterStyle.header}>
            <View />
            <LanguageSelector compact />
          </View>

          {/* Logo section - centered */}
          <Animated.View style={[loginRegisterStyle.logoSection, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
            <View style={loginRegisterStyle.mascotContainer}>
              <AnimatedSparkle style={loginRegisterStyle.sparkleTop} />
              <View style={loginRegisterStyle.logoGlow}>
                <Image
                  source={require('../assets/logo.png')}
                  style={loginRegisterStyle.mascotImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Text style={loginRegisterStyle.logoTitle}>CampusZen</Text>
            <Text style={loginRegisterStyle.title}>{t('register_title')}</Text>
            <Text style={loginRegisterStyle.subtitle}>{t('register_subtitle')}</Text>
          </Animated.View>

          {/* Form section - bottom */}
          <Animated.View style={[loginRegisterStyle.formSection, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>
            {/* Login field */}
            <Text style={loginRegisterStyle.label}>{t('login_label')}</Text>
            <View ref={emailInputRef} style={loginRegisterStyle.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#999" style={loginRegisterStyle.inputIcon} />
              <TextInput
                placeholder={t('login_placeholder')}
                placeholderTextColor="#999"
                value={login}
                onChangeText={setLogin}
                onFocus={() => scrollToInput(emailInputRef)}
                style={loginRegisterStyle.input}
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
            <AnimatedButton style={loginRegisterStyle.button} onPress={handleRegister}>
              <Text style={loginRegisterStyle.buttonText}>{t('register_button')}</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </AnimatedButton>

            {message ? <Text style={loginRegisterStyle.message}>{message}</Text> : null}

            {/* Login link */}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={loginRegisterStyle.registerText}>
                {t('has_account')} <Text style={loginRegisterStyle.registerLink}>{t('login_link')}</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
