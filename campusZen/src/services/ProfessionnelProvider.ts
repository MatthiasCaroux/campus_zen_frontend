import { apiClient } from "./apiClient";
import { ENDPOINTS } from "../config/apiConfig";

/**
 * Service de gestion des professionnels
 * Fournit les opérations CRUD pour les professionnels de santé
 */

/**
 * Récupère tous les professionnels
 */
export async function getProfessionnels() {
  try {
    const data = await apiClient.get(ENDPOINTS.PROFESSIONNELS.LIST);
    return data;
  } catch (error: any) {
    console.error("Erreur récupération des professionnels:", error.message);
    throw error;
  }
}

/**
 * Récupère un professionnel par son ID
 */
export async function getProfessionnelsById(id: number) {
  try {
    const data = await apiClient.get(ENDPOINTS.PROFESSIONNELS.DETAIL(id));
    return data;
  } catch (error: any) {
    console.error("Erreur récupération du professionnel:", error.message);
    throw error;
  }
}

/**
 * Crée un nouveau professionnel
 */
export async function createProfessionnel(professionnel: any) {
  try {
    const data = await apiClient.post(ENDPOINTS.PROFESSIONNELS.LIST, professionnel);
    return data;
  } catch (error: any) {
    console.error("Erreur création du professionnel:", error.message);
    throw error;
  }
}

/**
 * Met à jour un professionnel existant
 */
export async function updateProfessionnel(id: number, professionnel: any) {
  try {
    const data = await apiClient.put(ENDPOINTS.PROFESSIONNELS.DETAIL(id), professionnel);
    return data;
  } catch (error: any) {
    console.error("Erreur mise à jour du professionnel:", error.message);
    throw error;
  }
}

/**
 * Supprime un professionnel
 */
export async function deleteProfessionnel(id: number) {
  try {
    await apiClient.delete(ENDPOINTS.PROFESSIONNELS.DETAIL(id));
  } catch (error: any) {
    console.error("Erreur suppression du professionnel:", error.message);
    throw error;
  }
}



