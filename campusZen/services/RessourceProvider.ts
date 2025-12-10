import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/endpoints";
import { getAccessToken } from "./SecureStorage";

export async function getRessources () {
  try {
    const token = await getAccessToken();
    if (token === null) {
      throw new Error("Token d'accès manquant");
    }
    const response = await axios.get(`${API_URL}ressources/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur récupération des ressources :", error.response?.data || error.message);
    throw error;
  }
};


export async function getRessourceById (id: number) {
  try {
    const token = await getAccessToken();
    if (token === null) {
      throw new Error("Token d'accès manquant");
    }
    const response = await axios.get(`${API_URL}ressources/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur récupération des ressources :", error.response?.data || error.message);
    throw error;
  }
};

export async function createRessource (data: any) {
  try {
    const token = await getAccessToken();
    if (token === null) {
      throw new Error("Token d'accès manquant");
    }
    const response = await axios.post(`${API_URL}ressources/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur création de la ressource :", error.response?.data || error.message);
    throw error;
  }
};

export async function updateRessource (id: number, data: any) {
  try {
    const token = await getAccessToken();
    if (token === null) {
      throw new Error("Token d'accès manquant");
    }
    const response = await axios.put(`${API_URL}ressources/${id}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur mise à jour de la ressource :", error.response?.data || error.message);
    throw error;
  }
};

export async function deleteRessource (id: number) {
  try {
    const token = await getAccessToken();
    if (token === null) {
      throw new Error("Token d'accès manquant");
    }
    const response = await axios.delete(`${API_URL}ressources/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur suppression de la ressource :", error.response?.data || error.message);
    throw error;
  }
};




