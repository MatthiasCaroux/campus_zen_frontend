import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/endpoints";
import { getAccessToken } from "./SecureStorage";

export async function getProfessionnels () {
  try {
    const token = await getAccessToken();
    if (token === null) {
      throw new Error("Token d'accès manquant");
    }
    const response = await axios.get(`${API_URL}professionnels/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur récupération des professionnels :", error.response?.data || error.message);
    throw error;
  }
};


export async function getProfessionnelsById (id: number) {
  try {
    const token = await getAccessToken();
    if (token === null) {
      throw new Error("Token d'accès manquant");
    }
    const response = await axios.get(`${API_URL}professionnels/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur récupération des professionnels :", error.response?.data || error.message);
    throw error;
  }
};

export async function createProfessionnel (professionnel: any) {
  try {
    const token = await getAccessToken();
    if (token === null) {
      throw new Error("Token d'accès manquant");
    }
    const response = await axios.post(`${API_URL}professionnels/`, professionnel, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur création du professionnel :", error.response?.data || error.message);
    throw error;
  }
};

export async function updateProfessionnel (id: number, professionnel: any) {
  try {
    const token = await getAccessToken();
    if (token === null) {
      throw new Error("Token d'accès manquant");
    }
    const response = await axios.put(`${API_URL}professionnels/${id}/`, professionnel, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur mise à jour du professionnel :", error.response?.data || error.message);
    throw error;
  }
};

export async function deleteProfessionnel (id: number) {
  try {
    const token = await getAccessToken();
    if (token === null) {
      throw new Error("Token d'accès manquant");
    }
    await axios.delete(`${API_URL}professionnels/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    console.error("Erreur suppression du professionnel :", error.response?.data || error.message);
    throw error;
  }
};



