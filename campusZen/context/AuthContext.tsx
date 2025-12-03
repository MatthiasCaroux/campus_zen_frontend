import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: any) => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  setAccessToken: (token: string) => Promise<void>;
  getRefreshToken: () => Promise<string | null>;
  setRefreshToken: (token: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => { },
  login: async () => { },
  logout: async () => { },
  setUser: async () => { },
  getAccessToken: async () => null,
  setAccessToken: async () => { },
  getRefreshToken: async () => null,
  setRefreshToken: async () => { },
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

  const getAccessToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem("accessToken");
  };

  const setAccessToken = async (token: string): Promise<void> => {
    await AsyncStorage.setItem("accessToken", token);
  };

  const getRefreshToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem("refreshToken");
  }

  const setRefreshToken = async (token: string): Promise<void> => {
    await AsyncStorage.setItem("refreshToken", token);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout, setUser, getAccessToken, setAccessToken, getRefreshToken, setRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};
