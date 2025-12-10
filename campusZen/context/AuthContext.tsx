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
      const token = await getAccessToken();
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  const login = async (access: string, refresh: string) => {
    await saveTokens(access, refresh);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    console.log("Déconnexion de l'utilisateur");
    await deleteTokens();
    console.log("Suppression des informations utilisateur stockées");
    await AsyncStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  const setUser = async (user: any) => {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
