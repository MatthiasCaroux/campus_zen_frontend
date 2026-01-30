import { apiClient } from "./apiClient";
import { ENDPOINTS } from "../config/apiConfig";

// service ressources
// appels api crud pour les ressources

// liste ressources
export async function getRessources() {
  try {
    const data = await apiClient.get(ENDPOINTS.RESSOURCES.LIST);
    return data;
  } catch (error: any) {
    console.error("Erreur récupération des ressources:", error.message);
    throw error;
  }
}

// detail ressource
export async function getRessourceById(id: number) {
  try {
    const data = await apiClient.get(ENDPOINTS.RESSOURCES.DETAIL(id));
    return data;
  } catch (error: any) {
    console.error("Erreur récupération de la ressource:", error.message);
    throw error;
  }
}

// creation ressource
export async function createRessource(data: any) {
  try {
    const result = await apiClient.post(ENDPOINTS.RESSOURCES.LIST, data);
    return result;
  } catch (error: any) {
    console.error("Erreur création de la ressource:", error.message);
    throw error;
  }
}

// maj ressource
export async function updateRessource(id: number, data: any) {
  try {
    const result = await apiClient.put(ENDPOINTS.RESSOURCES.DETAIL(id), data);
    return result;
  } catch (error: any) {
    console.error("Erreur mise à jour de la ressource:", error.message);
    throw error;
  }
}

// suppression ressource
export async function deleteRessource(id: number) {
  try {
    const result = await apiClient.delete(ENDPOINTS.RESSOURCES.DETAIL(id));
    return result;
  } catch (error: any) {
    console.error("Erreur suppression de la ressource:", error.message);
    throw error;
  }
}




