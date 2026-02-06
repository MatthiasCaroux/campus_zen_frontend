import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "./apiClient";
import { ENDPOINTS } from "../config/apiConfig";

// service auth
// centralise les appels api pour login register refresh et recuperation user

// recupere un message aleatoire lie a un climat
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

// inscription
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

// connexion
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

// infos du user courant cote api
export async function getAPICurrentUser(token: string) {
  try {
    const data = await apiClient.get(ENDPOINTS.AUTH.ME);
    return data;
  } catch (error: any) {
    console.error("Erreur récupération utilisateur:", error.message);
    throw error;
  }
}

// liste des statuts
export async function getStatuts() {
  try {
    const data = await apiClient.get(ENDPOINTS.STATUTS.LIST);
    return data;
  } catch (error: any) {
    console.error("Erreur récupération statuts:", error.message);
    throw error;
  }
}

// refresh access token avec le refresh token
export const refreshToken = async (refresh: string) => {
  try {
    const data = await apiClient.post(ENDPOINTS.AUTH.REFRESH, { refresh });
    return data;
  } catch (error: any) {
    console.error("Erreur rafraîchissement token:", error.message);
    throw error;
  }
};

// recupere un climat par id
export async function getClimatById(id: number) {
  try {
    const data = await apiClient.get(ENDPOINTS.CLIMATS.DETAIL(id));
    return data;
  } catch (error: any) {
    console.error("Erreur récupération climat:", error.message);
    throw error;
  }
}

// recupere le user stocke en local
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

