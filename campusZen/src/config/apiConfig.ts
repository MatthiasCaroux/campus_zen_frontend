// config centralisee de l api

// url de base de l api
export const API_BASE_URL = 'https://incidents-bouake.com/api/';

// endpoints de l api
export const ENDPOINTS = {
  // authentification
  AUTH: {
    LOGIN: 'token/',
    REGISTER: 'register/',
    REFRESH: 'token/refresh/',
    ME: 'me/',
  },
  
  // ressources
  RESSOURCES: {
    LIST: 'ressources/',
    DETAIL: (id: number) => `ressources/${id}/`,
  },
  
  // professionnels
  PROFESSIONNELS: {
    LIST: 'professionnels/',
    DETAIL: (id: number) => `professionnels/${id}/`,
  },
  
  // climats
  CLIMATS: {
    LIST: 'climats/',
    DETAIL: (id: number) => `climats/${id}/`,
  },
  
  // messages
  MESSAGES: {
    LIST: 'messages/',
    BY_CLIMAT: (climatId: number) => `messages/?idClimat=${climatId}`,
  },
  
  // statuts
  STATUTS: {
    LIST: 'statuts/',
  },
  
  // questionnaires
  QUESTIONNAIRES: {
    LIST: 'questionnaires/',
    DETAIL: (id: number) => `questionnaires/${id}/`,
  },
  
  // questions
  QUESTIONS: {
    LIST: 'questions/',
    BY_QUESTIONNAIRE: (questionnaireId: number) => `questions/?questionnaireId=${questionnaireId}`,
  },
  
  // reponses
  REPONSES: {
    LIST: 'reponses/',
    DETAIL: (id: number) => `reponses/${id}/`,
    BY_QUESTION: (questionId: number) => `reponses/?question=${questionId}`,
  },
} as const;
