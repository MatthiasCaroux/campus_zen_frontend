import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapsScreen from "../screens/MapsScreen";
import ProDetailsScreen from "../screens/ProDetailsScreen";

const Stack = createNativeStackNavigator();

/**
 * Stack de navigation pour l'onglet Maps
 * Gère la navigation entre la carte et les détails des professionnels
 */
export default function MapsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MapsMain"
        component={MapsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProDetailsScreen"
        component={ProDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
