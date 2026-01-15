import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

/**
 * Stack de navigation pour l'authentification
 * Gère les écrans de connexion et d'inscription
 */
export default function AuthStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: "Connexion" }} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ title: "Inscription" }} 
      />
    </Stack.Navigator>
  );
}
