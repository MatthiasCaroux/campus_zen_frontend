import { apiClient } from "./apiClient";
import { ENDPOINTS } from "../config/apiConfig";

/**
 * Service de gestion des questionnaires et questions
 * Fournit les opérations CRUD pour les questionnaires et leurs questions
 */

/**
 * Récupère tous les questionnaires
 */
export async function getQuestionnaires() {
  try {
    const data = await apiClient.get(ENDPOINTS.QUESTIONNAIRES.LIST);
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error("Erreur récupération des questionnaires:", error.message);
    throw error;
  }
}

/**
 * Récupère un questionnaire par son ID
 */
export async function getQuestionnaireById(id: number) {
  try {
    const data = await apiClient.get(ENDPOINTS.QUESTIONNAIRES.DETAIL(id));
    return data;
  } catch (error: any) {
    console.error("Erreur récupération du questionnaire:", error.message);
    throw error;
  }
}

/**
 * Crée un nouveau questionnaire
 */
export async function createQuestionnaire(data: any) {
  try {
    const result = await apiClient.post(ENDPOINTS.QUESTIONNAIRES.LIST, data);
    return result;
  } catch (error: any) {
    console.error("Erreur création du questionnaire:", error.message);
    throw error;
  }
}

/**
 * Met à jour un questionnaire existant
 */
export async function updateQuestionnaire(id: number, data: any) {
  try {
    const result = await apiClient.put(ENDPOINTS.QUESTIONNAIRES.DETAIL(id), data);
    return result;
  } catch (error: any) {
    console.error("Erreur mise à jour du questionnaire:", error.message);
    throw error;
  }
}

/**
 * Supprime un questionnaire
 */
export async function deleteQuestionnaire(id: number) {
  try {
    const result = await apiClient.delete(ENDPOINTS.QUESTIONNAIRES.DETAIL(id));
    return result;
  } catch (error: any) {
    console.error("Erreur suppression du questionnaire:", error.message);
    throw error;
  }
}

// ===== QUESTIONS =====

/**
 * Récupère toutes les questions
 */
export async function getQuestions() {
  try {
    const data = await apiClient.get(ENDPOINTS.QUESTIONS.LIST);
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error("Erreur récupération des questions:", error.message);
    throw error;
  }
}

/**
 * Récupère les questions d'un questionnaire spécifique
 */
export async function getQuestionsByQuestionnaireId(questionnaireId: number) {
  try {
    const data = await apiClient.get(ENDPOINTS.QUESTIONS.BY_QUESTIONNAIRE(questionnaireId));
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error("Erreur récupération des questions:", error.message);
    throw error;
  }
}

// ===== RÉPONSES =====

/**
 * Récupère toutes les réponses
 */
export async function getReponses() {
  try {
    const data = await apiClient.get(ENDPOINTS.REPONSES.LIST);
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error("Erreur récupération des réponses:", error.message);
    throw error;
  }
}

/**
 * Récupère les réponses d'une question spécifique
 */
export async function getReponsesByQuestionId(questionId: number) {
  try {
    const data = await apiClient.get(ENDPOINTS.REPONSES.BY_QUESTION(questionId));
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error("Erreur récupération des réponses:", error.message);
    throw error;
  }
}

/**
 * Récupère une réponse par son ID
 */
export async function getReponseById(id: number) {
  try {
    const data = await apiClient.get(ENDPOINTS.REPONSES.DETAIL(id));
    return data;
  } catch (error: any) {
    console.error("Erreur récupération de la réponse:", error.message);
    throw error;
  }
}

/**
 * Crée une nouvelle réponse
 */
export async function createReponse(data: any) {
  try {
    const result = await apiClient.post(ENDPOINTS.REPONSES.LIST, data);
    return result;
  } catch (error: any) {
    console.error("Erreur création de la réponse:", error.message);
    throw error;
  }
}

/**
 * Met à jour une réponse existante
 */
export async function updateReponse(id: number, data: any) {
  try {
    const result = await apiClient.put(ENDPOINTS.REPONSES.DETAIL(id), data);
    return result;
  } catch (error: any) {
    console.error("Erreur mise à jour de la réponse:", error.message);
    throw error;
  }
}

/**
 * Supprime une réponse
 */
export async function deleteReponse(id: number) {
  try {
    const result = await apiClient.delete(ENDPOINTS.REPONSES.DETAIL(id));
    return result;
  } catch (error: any) {
    console.error("Erreur suppression de la réponse:", error.message);
    throw error;
  }
}
