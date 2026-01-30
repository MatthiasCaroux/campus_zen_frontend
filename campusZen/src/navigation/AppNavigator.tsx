import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { AuthContext } from "../context/AuthContext";
import TabNavigator from "./TabNavigator";
import AuthStackNavigator from "./AuthStackNavigator";
import { useAuthInit } from "../hooks/useAuthInit";

// navigation principale
// si on est connecte on affiche les tabs sinon le stack auth
export default function AppNavigator() {
  const { isAuthenticated, setIsAuthenticated, logout } = useContext(AuthContext);

  // init auth au demarrage
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
