import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/endpoints";

export async function getRessources () {
  try {
    const token = await AsyncStorage.getItem("accessToken");
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


export async function getRessourcesById (id: number) {
  try {
    const token = await AsyncStorage.getItem("accessToken");
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


