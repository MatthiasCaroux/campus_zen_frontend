import React, { use, useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import MainTabs from "./MainTabs";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { getCurrentUser, refreshToken } from "./services/AuthService";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isAuthenticated, setIsAuthenticated, logout } = useContext(AuthContext);
  const [user, setUser] = useState<any>(null); 

    useEffect(() => {
      const init = async () => {
        const data = await getCurrentUser();
        if (!data) {
          return;
        }
        setUser(data);

        console.log("Vérification des tokens pour l'utilisateur :", data);

        if (!data.endRefresh) {
          setIsAuthenticated(false);
          return;
        }

        const now = new Date();
        const endAccess = new Date(data.endAccess);
        const endRefresh = new Date(data.endRefresh);

        if (now >= endRefresh) {
          console.log("Le token de rafraîchissement a expiré. Veuillez vous reconnecter.");
          logout();
        } else if (now >= endAccess) {
          console.log("Le token d'accès a expiré. Tentative de rafraîchissement...");
          const newAccessToken = await refreshToken(data.refresh);
          if (newAccessToken.access) {
            console.log("Token d'accès rafraîchi avec succès.");
            setIsAuthenticated(true);
          } else {
            console.log("Échec du rafraîchissement du token d'accès. Veuillez vous reconnecter.");
            setIsAuthenticated(false);
          }
        } 
      };
      init();
    }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {isAuthenticated ? (
        <MainTabs />
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Connexion" }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Inscription" }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
