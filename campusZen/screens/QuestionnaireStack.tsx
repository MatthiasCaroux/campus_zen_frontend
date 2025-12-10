import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QuestionnaireScreen from "./admin/QuestionnaireScreen";
import QuestionnaireListScreen from "./QuestionnaireListScreen";
import QuestionnaireQuestions from "./QuestionnaireQuestions";
import ReponseQuestions from "./ReponseQuestions";
import ResponseFormScreen from "./ResponseFormScreen";
import QuestionFormScreen from "./QuestionFormScreen";

const Stack = createNativeStackNavigator();

export default function QuestionnaireStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="QuestionnaireMain" component={QuestionnaireScreen} />
      <Stack.Screen name="QuestionnaireList" component={QuestionnaireListScreen} />
      <Stack.Screen name="QuestionnaireQuestions" component={QuestionnaireQuestions} />
      <Stack.Screen name="ReponseQuestions" component={ReponseQuestions} />
      <Stack.Screen name="ResponseForm" component={ResponseFormScreen} />
      <Stack.Screen name="QuestionForm" component={QuestionFormScreen} />
      
    </Stack.Navigator>
  );
}
