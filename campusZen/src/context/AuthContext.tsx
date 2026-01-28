import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { saveTokens, getTokens, deleteTokens, getAccessToken } from "../services/SecureStorage";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: any) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => { },
  login: async () => { },
  logout: async () => { },
  setUser: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    const checkAuth = async () => {
      // sur web: on suppose auth si on peut accéder à l'API (cookies HttpOnly envoyés auto)
      // sur mobile: on vérifie le token en SecureStore
      if (isWeb) {
        // sur web, on part du principe qu'on est auth si les cookies existent
        // (impossible de les lire car HttpOnly)
        setIsAuthenticated(true);
      } else {
        const token = await getAccessToken();
        setIsAuthenticated(!!token);
      }
    };
    checkAuth();
  }, [isWeb]);

  const login = async (access: string, refresh: string) => {
    // sur web: les tokens sont déjà dans les HttpOnly cookies (backend)
    // sur mobile: on stocke dans SecureStore
    if (!isWeb) {
      await saveTokens(access, refresh);
    }
    setIsAuthenticated(true);
  };

  const logout = async () => {
    // sur web: appeler /logout pour supprimer les HttpOnly cookies côté serveur
    // sur mobile: nettoyer le SecureStore local
    if (isWeb) {
      try {
        // appeler l'endpoint de déconnexion (supprime les cookies HttpOnly)
        const { apiClient } = await import("../services/apiClient");
        await apiClient.post("/logout/");
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
      }
    } else {
      await deleteTokens();
    }
    await AsyncStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  const setUser = async (user: any) => {
    // petit cache local du user pour eviter de le redemander tout le temps
    await AsyncStorage.setItem("user", JSON.stringify(user));
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
