import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { AuthContext } from "../context/AuthContext";
import TabNavigator from "./TabNavigator";
import AuthStackNavigator from "./AuthStackNavigator";
import { useAuthInit } from "../hooks/useAuthInit";

/**
 * Composant racine de navigation de l'application
 * Gère l'affichage conditionnel entre les écrans d'authentification et l'application principale
 * 
 * Structure de navigation :
 * - Non authentifié : AuthStack (Login -> Register)
 * - Authentifié : TabNavigator
 *   ├── Home Stack (Accueil -> Questionnaire -> Questions -> ConsultEtat)
 *   ├── Maps Stack (Maps -> ProDetails)
 *   ├── Ressources Stack (Ressources)
 *   └── Compte Stack (Compte)
 */
export default function AppNavigator() {
  const { isAuthenticated, setIsAuthenticated, logout } = useContext(AuthContext);
  
  // Initialisation de l'authentification au démarrage
  useAuthInit({ setIsAuthenticated, logout });

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {isAuthenticated ? (
        <TabNavigator />
      ) : (
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
}
