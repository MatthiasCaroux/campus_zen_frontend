import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import MainTabs from "./MainTabs";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { getStoredUser, refreshToken } from "./services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRefreshToken, setAccessToken } from "./services/SecureStorage";

const Stack = createNativeStackNavigator();
const accessTokenDuration = 60 * 60 * 1000;

function AppNavigator() {
  const { isAuthenticated, setIsAuthenticated, logout, setAccessToken } = useContext(AuthContext);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const data = await getStoredUser();
      if (!data) {
        return;
      }
      setUser(data);

      console.log("Vérification des tokens pour l'utilisateur");

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
        const tokenRefresh = await getRefreshToken();
        if (!tokenRefresh) {
          console.log("Aucun token de rafraîchissement trouvé. Veuillez vous reconnecter.");
          setIsAuthenticated(false);
          return;
        }

        const newAccessToken = await refreshToken(tokenRefresh);
        if (newAccessToken.access) {
          console.log("Token d'accès rafraîchi avec succès.");
          await setAccessToken(newAccessToken.access);
          await AsyncStorage.setItem("user", JSON.stringify({
            ...data,
            endAccess: new Date(Date.now() + accessTokenDuration),
          }));
          setIsAuthenticated(true);
        } else {
          console.log("Échec du rafraîchissement du token d'accès. Veuillez vous reconnecter.");
          setIsAuthenticated(false);
        }
      } else {
        console.log("Les tokens sont valides. L'utilisateur est authentifié.");
        setIsAuthenticated(true);
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
      <LanguageProvider>
        <AppNavigator />
      </LanguageProvider>
    </AuthProvider>
  );
}
