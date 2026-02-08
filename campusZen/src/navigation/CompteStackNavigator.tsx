import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CompteScreen from "../screens/CompteScreen";
import AboutScreen from "../screens/AboutScreen";

const Stack = createNativeStackNavigator();

/**
 * Stack de navigation pour l'onglet Compte
 * Permet l'ajout futur d'écrans de paramètres ou de profil
 */
export default function CompteStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="CompteMain"
        component={CompteScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
