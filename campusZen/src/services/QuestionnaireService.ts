import { apiClient } from "./apiClient";
import { ENDPOINTS } from "../config/apiConfig";

// service questionnaires questions reponses
// centralise les appels api et renvoie des listes propres

// liste des questionnaires
export async function getQuestionnaires() {
  try {
    const data = await apiClient.get(ENDPOINTS.QUESTIONNAIRES.LIST);
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error("Erreur récupération des questionnaires:", error.message);
    throw error;
  }
}

// detail questionnaire
export async function getQuestionnaireById(id: number) {
  try {
    const data = await apiClient.get(ENDPOINTS.QUESTIONNAIRES.DETAIL(id));
    return data;
  } catch (error: any) {
    console.error("Erreur récupération du questionnaire:", error.message);
    throw error;
  }
}

// creation questionnaire
export async function createQuestionnaire(data: any) {
  try {
    const result = await apiClient.post(ENDPOINTS.QUESTIONNAIRES.LIST, data);
    return result;
  } catch (error: any) {
    console.error("Erreur création du questionnaire:", error.message);
    throw error;
  }
}

// maj questionnaire
export async function updateQuestionnaire(id: number, data: any) {
  try {
    const result = await apiClient.put(ENDPOINTS.QUESTIONNAIRES.DETAIL(id), data);
    return result;
  } catch (error: any) {
    console.error("Erreur mise à jour du questionnaire:", error.message);
    throw error;
  }
}

// suppression questionnaire
export async function deleteQuestionnaire(id: number) {
  try {
    const result = await apiClient.delete(ENDPOINTS.QUESTIONNAIRES.DETAIL(id));
    return result;
  } catch (error: any) {
    console.error("Erreur suppression du questionnaire:", error.message);
    throw error;
  }
}

// questions

// liste des questions
export async function getQuestions() {
  try {
    const data = await apiClient.get(ENDPOINTS.QUESTIONS.LIST);
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error("Erreur récupération des questions:", error.message);
    throw error;
  }
}

// questions pour un questionnaire
export async function getQuestionsByQuestionnaireId(questionnaireId: number) {
  try {
    const data = await apiClient.get(ENDPOINTS.QUESTIONS.BY_QUESTIONNAIRE(questionnaireId));
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error("Erreur récupération des questions:", error.message);
    throw error;
  }
}

// reponses

// liste des reponses
export async function getReponses() {
  try {
    const data = await apiClient.get(ENDPOINTS.REPONSES.LIST);
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error("Erreur récupération des réponses:", error.message);
    throw error;
  }
}

// reponses pour une question
export async function getReponsesByQuestionId(questionId: number) {
  try {
    const data = await apiClient.get(ENDPOINTS.REPONSES.BY_QUESTION(questionId));
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error("Erreur récupération des réponses:", error.message);
    throw error;
  }
}

// detail reponse
export async function getReponseById(id: number) {
  try {
    const data = await apiClient.get(ENDPOINTS.REPONSES.DETAIL(id));
    return data;
  } catch (error: any) {
    console.error("Erreur récupération de la réponse:", error.message);
    throw error;
  }
}

// creation reponse
export async function createReponse(data: any) {
  try {
    const result = await apiClient.post(ENDPOINTS.REPONSES.LIST, data);
    return result;
  } catch (error: any) {
    console.error("Erreur création de la réponse:", error.message);
    throw error;
  }
}

// maj reponse
export async function updateReponse(id: number, data: any) {
  try {
    const result = await apiClient.put(ENDPOINTS.REPONSES.DETAIL(id), data);
    return result;
  } catch (error: any) {
    console.error("Erreur mise à jour de la réponse:", error.message);
    throw error;
  }
}

// suppression reponse
export async function deleteReponse(id: number) {
  try {
    const result = await apiClient.delete(ENDPOINTS.REPONSES.DETAIL(id));
    return result;
  } catch (error: any) {
    console.error("Erreur suppression de la réponse:", error.message);
    throw error;
  }
}
