import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAccessToken } from '../services/SecureStorage';
import { API_BASE_URL } from '../config/apiConfig';

/**
 * Client API centralisé avec gestion automatique des tokens
 */
class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configure les intercepteurs pour ajouter automatiquement le token
   */
  private setupInterceptors(): void {
    // Intercepteur de requêtes - Ajoute le token d'authentification
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur de réponses - Gestion globale des erreurs
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(error: any): void {
    if (error.response) {
      console.error('Erreur API:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Aucune réponse du serveur:', error.request);
    } else {
      console.error('Erreur:', error.message);
    }
  }

  /**
   * Requête GET
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  /**
   * Requête POST
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  /**
   * Requête PUT
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  /**
   * Requête DELETE
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response.data;
  }
}

// Instance unique du client API
export const apiClient = new ApiClient();

/**
 * Fonction pour tester la connexion à l'API
 * Utilisée principalement pour les diagnostics et les écrans de statut
 */
export const testApiConnection = async () => {
  try {
    // Teste avec la route /statuts/ qui existe sur l'API
    const data = await apiClient.get('/statuts/', { timeout: 5000 });
    console.log('✅ Connexion à l\'API réussie:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Échec de la connexion à l\'API:', error);
    // Retourne plus d'informations sur l'erreur
    return {
      success: false,
      error: error.message,
      details: error.response ? `Status: ${error.response.status}` : 'Aucune réponse du serveur'
    };
  }
};
