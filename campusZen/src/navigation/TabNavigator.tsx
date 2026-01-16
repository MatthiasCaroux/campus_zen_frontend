import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeStackNavigator from "./HomeStackNavigator";
import MapsStackNavigator from "./MapsStackNavigator";
import RessourcesStackNavigator from "./RessourcesStackNavigator";
import CompteStackNavigator from "./CompteStackNavigator";

const Tab = createBottomTabNavigator();

/**
 * Configuration des icônes pour les onglets de navigation
 */
const getTabBarIcon = (route: any, focused: boolean, color: string, size: number) => {
  let iconName: keyof typeof Ionicons.glyphMap;

  switch (route.name) {
    case "Home":
      iconName = focused ? "home" : "home-outline";
      break;
    case "Maps":
      iconName = focused ? "map" : "map-outline";
      break;
    case "Ressources":
      iconName = focused ? "book" : "book-outline";
      break;
    case "Compte":
      iconName = focused ? "person" : "person-outline";
      break;
    default:
      iconName = "help-outline";
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

/**
 * Navigateur à onglets principal de l'application
 * Gère les 4 onglets principaux, chacun avec son propre stack
 */
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => 
          getTabBarIcon(route, focused, color, size),
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator} 
        options={{ tabBarLabel: "Accueil" }} 
      />
      <Tab.Screen 
        name="Maps" 
        component={MapsStackNavigator} 
        options={{ tabBarLabel: "Maps" }} 
      />
      <Tab.Screen 
        name="Ressources" 
        component={RessourcesStackNavigator} 
        options={{ tabBarLabel: "Ressources" }} 
      />
      <Tab.Screen 
        name="Compte" 
        component={CompteStackNavigator} 
        options={{ tabBarLabel: "Compte" }} 
      />
    </Tab.Navigator>
  );
}
