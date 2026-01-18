import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

  useEffect(() => {
    const checkAuth = async () => {
      // au lancement on regarde si on a un access token valide en stockage
      const token = await getAccessToken();
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  const login = async (access: string, refresh: string) => {
    // on stocke les tokens puis on passe l etat auth a true
    await saveTokens(access, refresh);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    // on nettoie tokens et user local puis on repasse en non connecte
    console.log("Déconnexion de l'utilisateur");
    await deleteTokens();
    console.log("Suppression des informations utilisateur stockées");
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
