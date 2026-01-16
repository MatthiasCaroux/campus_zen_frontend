/**
 * Configuration centralisée de l'API
 */

// URL de base de l'API
export const API_BASE_URL = __DEV__
  ? 'https://incidents-bouake.com/api/' 
  : 'https://incidents-bouake.com/api/';

// Endpoints de l'API
export const ENDPOINTS = {
  // Authentification
  AUTH: {
    LOGIN: 'token/',
    REGISTER: 'register/',
    REFRESH: 'token/refresh/',
    ME: 'me/',
  },
  
  // Ressources
  RESSOURCES: {
    LIST: 'ressources/',
    DETAIL: (id: number) => `ressources/${id}/`,
  },
  
  // Professionnels
  PROFESSIONNELS: {
    LIST: 'professionnels/',
    DETAIL: (id: number) => `professionnels/${id}/`,
  },
  
  // Climats
  CLIMATS: {
    LIST: 'climats/',
    DETAIL: (id: number) => `climats/${id}/`,
  },
  
  // Messages
  MESSAGES: {
    LIST: 'messages/',
    BY_CLIMAT: (climatId: number) => `messages/?idClimat=${climatId}`,
  },
  
  // Statuts
  STATUTS: {
    LIST: 'statuts/',
  },
  
  // Questionnaires
  QUESTIONNAIRES: {
    LIST: 'questionnaires/',
    DETAIL: (id: number) => `questionnaires/${id}/`,
  },
  
  // Questions
  QUESTIONS: {
    LIST: 'questions/',
    BY_QUESTIONNAIRE: (questionnaireId: number) => `questions/?questionnaireId=${questionnaireId}`,
  },
  
  // Réponses
  REPONSES: {
    LIST: 'reponses/',
    DETAIL: (id: number) => `reponses/${id}/`,
    BY_QUESTION: (questionId: number) => `reponses/?question=${questionId}`,
  },
} as const;
