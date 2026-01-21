import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RessourcesScreen from "../screens/RessourcesScreen";

const Stack = createNativeStackNavigator();

// stack de navigation pour l'onglet ressources
// on garde un stack meme si on a qu un ecran pour pouvoir ajouter un detail plus tard
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
