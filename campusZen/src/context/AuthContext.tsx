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
      // sur web: on vérifie la session en appelant l'API (cookies HttpOnly envoyés auto)
      // sur mobile: on vérifie le token en SecureStore
      if (isWeb) {
        // Vérifier d'abord si l'utilisateur s'est explicitement déconnecté
        const loggedOut = await AsyncStorage.getItem("loggedOut");
        if (loggedOut === "true") {
          setIsAuthenticated(false);
          return;
        }
        
        try {
          // Vérifier si la session est valide en appelant l'endpoint /me/
          const { apiClient } = await import("../services/apiClient");
          const userData = await apiClient.get("/me/");
          console.log("[WEB AUTH] Session valide:", userData);
          setIsAuthenticated(true);
        } catch (error: any) {
          // Si l'appel échoue, l'utilisateur n'est pas authentifié
          console.log("[WEB AUTH] Session invalide:", error.response?.status);
          setIsAuthenticated(false);
          await AsyncStorage.removeItem("user");
        }
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
    } else {
      // Réinitialiser le flag de déconnexion lors du login
      await AsyncStorage.removeItem("loggedOut");
    }
    setIsAuthenticated(true);
  };

  const logout = async () => {
    // sur web: appeler /logout pour supprimer les HttpOnly cookies côté serveur
    // sur mobile: nettoyer le SecureStore local
    console.log("[LOGOUT] Déconnexion en cours...");
    
    if (isWeb) {
      // Marquer explicitement la déconnexion
      await AsyncStorage.setItem("loggedOut", "true");
      
      try {
        // appeler l'endpoint de déconnexion (supprime les cookies HttpOnly)
        const { apiClient } = await import("../services/apiClient");
        await apiClient.post("/logout/");
        console.log("[WEB LOGOUT] Cookies supprimés côté serveur");
      } catch (error) {
        console.error("[WEB LOGOUT] Erreur lors de la déconnexion:", error);
      }
      
      // Supprimer manuellement les cookies côté client (au cas où le backend ne le fait pas)
      if (typeof document !== "undefined") {
        // Supprimer tous les cookies possibles liés à l'authentification
        const cookies = ["access_token", "refresh_token", "sessionid", "csrftoken"];
        cookies.forEach(cookieName => {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.incidents-bouake.com;`;
        });
        console.log("[WEB LOGOUT] Cookies supprimés côté client");
      }
      
      // Nettoyer le cache local
      await AsyncStorage.removeItem("user");
      setIsAuthenticated(false);
      
      // Forcer le rechargement complet de la page pour supprimer tous les états
      console.log("[WEB LOGOUT] Rechargement de la page...");
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } else {
      await deleteTokens();
      await AsyncStorage.removeItem("user");
      setIsAuthenticated(false);
    }
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
