import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RessourcesScreen from "../screens/RessourcesScreen";

const Stack = createNativeStackNavigator();

/**
 * Stack de navigation pour l'onglet Ressources
 * Permet l'ajout futur d'écrans de détails ou de formulaires
 */
export default function RessourcesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="RessourcesMain"
        component={RessourcesScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
