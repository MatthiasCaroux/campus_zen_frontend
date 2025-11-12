import axios from "axios";
import { API_URL } from "../config/endpoints";

export async function getProfessionnels (token: string) {
  try {
    const response = await axios.get(`${API_URL}professionnels/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur récupération des professionnels :", error.response?.data || error.message);
    throw error;
  }
};