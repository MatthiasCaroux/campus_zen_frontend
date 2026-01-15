import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "./apiClient";
import { ENDPOINTS } from "../config/apiConfig";

/**
 * Service d'authentification
 * Gère les opérations de connexion, inscription et récupération des données utilisateur
 */

/**
 * Récupère un message aléatoire par ID de climat
 */
export async function getRandomMessageByClimatId(idclimat: number): Promise<string | null> {
  try {
    const messages = await apiClient.get<any[]>(ENDPOINTS.MESSAGES.BY_CLIMAT(idclimat));
    
    if (Array.isArray(messages) && messages.length > 0) {
      const randomIndex = Math.floor(Math.random() * messages.length);
      return messages[randomIndex].message;
    }
    return null;
  } catch (error: any) {
    console.error("Erreur récupération message:", error.message);
    return null;
  }
}

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (emailPers: string, passwordPers: string) => {
  try {
    const data = await apiClient.post(ENDPOINTS.AUTH.REGISTER, {
      emailPers,
      passwordPers,
    });
    return data;
  } catch (error: any) {
    console.error("Erreur inscription:", error.message);
    throw error;
  }
};

/**
 * Connexion d'un utilisateur
 */
export const login = async (emailPers: string, password: string) => {
  try {
    const data = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
      emailPers,
      password,
    });
    return data;
  } catch (error: any) {
    console.error("Erreur connexion:", error.message);
    throw error;
  }
};

/**
 * Récupère les informations de l'utilisateur actuel
 */
export async function getAPICurrentUser(token: string) {
  try {
    const data = await apiClient.get(ENDPOINTS.AUTH.ME);
    return data;
  } catch (error: any) {
    console.error("Erreur récupération utilisateur:", error.message);
    throw error;
  }
}

/**
 * Récupère la liste des statuts
 */
export async function getStatuts() {
  try {
    const data = await apiClient.get(ENDPOINTS.STATUTS.LIST);
    return data;
  } catch (error: any) {
    console.error("Erreur récupération statuts:", error.message);
    throw error;
  }
}

/**
 * Rafraîchit le token d'accès
 */
export const refreshToken = async (refresh: string) => {
  try {
    const data = await apiClient.post(ENDPOINTS.AUTH.REFRESH, { refresh });
    return data;
  } catch (error: any) {
    console.error("Erreur rafraîchissement token:", error.message);
    throw error;
  }
};

/**
 * Récupère le climat par son ID
 */
export async function getClimatById(id: number) {
  try {
    const data = await apiClient.get(ENDPOINTS.CLIMATS.DETAIL(id));
    return data;
  } catch (error: any) {
    console.error("Erreur récupération climat:", error.message);
    throw error;
  }
}

/**
 * Récupère l'utilisateur stocké localement
 */
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

