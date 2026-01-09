// Récupère le climat par son id
export async function getClimatById(id: number) {
  try {
    const token = await getAccessToken();
    const response = await axios.get(`${API_URL}climats/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur récupération climat:", error.response?.data || error.message);
    throw error;
  }
}
// Fonction utilitaire pour récupérer l'utilisateur stocké
export async function getStoredUser() {
  try {
    const data = await AsyncStorage.getItem("user");
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error("Erreur récupération utilisateur stocké:", error);
    return null;
  }
}
import axios from "axios";
import { API_URL } from "../config/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAccessToken } from "./SecureStorage";

export async function getRandomMessageByClimatId(idclimat: number) {
  try {
    const token = await getAccessToken();
    const response = await axios.get(`${API_URL}messages/?idClimat=${idclimat}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const messages = response.data;
    if (Array.isArray(messages) && messages.length > 0) {
      // Sélectionne un message aléatoire
      const randomIndex = Math.floor(Math.random() * messages.length);
      return messages[randomIndex].message;
    }
    return null;
  } catch (error: any) {
    console.error("Erreur récupération message:", error.response?.data || error.message);
    return null;
  }
}

export const register = async (emailPers: string, passwordPers: string) => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(`${API_URL}register/`, {
      emailPers,
      passwordPers,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur inscription:", error.response?.data || error.message);
    throw error;
  }
};

export const login = async (emailPers: string, password: string) => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(`${API_URL}token/`, {
      emailPers,
      password,
    }, {
      headers: { Authorization: `Bearer ${token}` },
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

export async function getStatuts() {
  try {
    const token = await getAccessToken();
    const response = await axios.get(`${API_URL}statuts/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur récupération statuts:", error.response?.data || error.message);
    throw error;
  }
}

export const refreshToken = async (refresh: string) => {
  try {
    const response = await axios.post(`${API_URL}token/refresh/`, { refresh });
    return response.data;
  } catch (error: any) {
    console.error("Erreur rafraîchissement token:", error.response?.data || error.message);
    throw error;
  } 
};

