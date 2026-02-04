import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import QuestionnaireScreen from "../screens/QuestionnaireScreen";
import QuestionsScreen from "../screens/QuestionsScreen";
import ConsultEtatScreen from "../screens/ConsultEtatScreen";
import EvolutionScreen from "../screens/EvolutionScreen";

const Stack = createNativeStackNavigator();

/**
 * Stack de navigation pour l'onglet Accueil
 * Gère la navigation entre l'écran d'accueil et les questionnaires
 */
export default function HomeStackNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Questionnaire"
        component={QuestionnaireScreen}
        options={{ title: "Questionnaire", headerShown: true }}
      />
      <Stack.Screen
        name="Questions"
        component={QuestionsScreen}
        options={{ title: "Questions", headerShown: true }}
      />
      <Stack.Screen
        name="ConsultEtat"
        component={ConsultEtatScreen}
        options={{ title: "Mon état", headerShown: true }}
      />
      <Stack.Screen
        name="Evolution"
        component={EvolutionScreen}
        options={{ title: "Mon évolution", headerShown: true }}
      />
    </Stack.Navigator>
  );
}
