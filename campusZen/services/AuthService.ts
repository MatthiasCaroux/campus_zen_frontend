import axios from "axios";
import { API_URL } from "../config/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const register = async (emailPers: string, passwordPers: string) => {
  try {
    const response = await axios.post(`${API_URL}register/`, {
      emailPers,
      passwordPers,
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur inscription:", error.response?.data || error.message);
    throw error;
  }
};

export const login = async (emailPers: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}token/`, {
      emailPers,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur connexion:", error.response?.data || error.message);
    throw error;
  }
};

export async function getAPICurrentUser (token: string) {
  try {
    const response = await axios.get(`${API_URL}me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur récupération utilisateur:", error.response?.data || error.message);
    throw error;
  }
};

export async function getCurrentUser() {
  const data = await AsyncStorage.getItem("user");
  if (data) {
    return JSON.parse(data);
  }
  return null;
}


