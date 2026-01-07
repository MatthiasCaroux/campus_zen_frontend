import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import MapsScreen from "./screens/MapsScreen";
import StatsScreen from "./screens/StatsScreen";
import CompteScreen from "./screens/CompteScreen";
import ProDetailsScreen from "./screens/ProDetailsScreen";
import QuestionnaireScreen from "./screens/QuestionnaireScreen";
import ConsultEtatScreen from "./screens/ConsultEtatScreen";
import QuestionsScreen from "./screens/QuestionsScreen";
import RessourcesScreen from "./screens/RessourcesScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

function MapsStack() {
  return (
    <Stack.Navigator>
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

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Questionnaire"
        component={QuestionnaireScreen}
        options={{ title: "Questionnaire", headerShown: true }}
      />
      <HomeStack.Screen
        name="Questions"
        component={QuestionsScreen}
        options={{ title: "Questions", headerShown: true }}
      />
      <HomeStack.Screen
        name="ConsultEtat"
        component={ConsultEtatScreen}
        options={{ title: "Mon état", headerShown: true }}
      />
    </HomeStack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Maps") iconName = focused ? "map" : "map-outline";
          else if (route.name === "Stats") iconName = focused ? "stats-chart" : "stats-chart-outline";
          else if (route.name === "Compte") iconName = focused ? "person" : "person-outline";
          else if (route.name === "Ressources") iconName = focused ? "book" : "book-outline";
          else iconName = "help-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}

    >
      <Tab.Screen name="Home" component={HomeStackNavigator} options={{ tabBarLabel: "Accueil" }} />
      <Tab.Screen name="Maps" component={MapsStack} options={{ tabBarLabel: "Maps" }} />
      <Tab.Screen name="Ressources" component={RessourcesScreen} options={{ tabBarLabel: "Ressources" }} />
      {/*
      <Tab.Screen name="Stats" component={StatsScreen} options={{ title: "Statistiques", tabBarLabel: "Stats" }} />
      */}
      <Tab.Screen name="Compte" component={CompteScreen} options={{ tabBarLabel: "Compte" }} />

    </Tab.Navigator>
  );
} 
