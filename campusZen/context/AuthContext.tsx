import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: any) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  setUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  const login = async (access: string, refresh: string) => {
    await AsyncStorage.setItem("accessToken", access);
    await AsyncStorage.setItem("refreshToken", refresh);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  const setUser = async (user: any) => {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
