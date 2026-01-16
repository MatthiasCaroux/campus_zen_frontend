import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QuestionnaireScreen from "./QuestionnaireScreen";
import QuestionsScreen from "./QuestionsScreen";

const Stack = createNativeStackNavigator();

export default function QuestionnaireStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="QuestionnaireMain" component={QuestionnaireScreen} />
      <Stack.Screen name="QuestionsScreen" component={QuestionsScreen} />
    </Stack.Navigator>
  );
}
