import axios from 'axios';

// Configuration de l'URL de base de l'API
const API_BASE_URL = __DEV__
  // ? 'http://localhost:8000/api/' // URL pour le développement
  ? 'http://54.38.35.105:8000/api/' // URL pour le développement
  : 'https://votre-api-production.com/api'; // URL pour la production

// Création de l'instance axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout de 10 secondes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes
apiClient.interceptors.request.use(
  (config) => {
    // Vous pouvez ajouter un token d'authentification ici si nécessaire
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion globale des erreurs
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.error('Erreur API:', error.response.status, error.response.data);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Aucune réponse du serveur:', error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur:', error.message);
    }
    return Promise.reject(error);
  }
);

// Fonction pour tester la connexion à l'API
export const testApiConnection = async () => {
  try {
    const response = await apiClient.get('/'); // Teste la racine de l'API
    console.log('✅ Connexion à l\'API réussie:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Échec de la connexion à l\'API:', error.message);
    return { success: false, error: error.message };
  }
};

export default apiClient;