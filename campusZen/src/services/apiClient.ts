import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAccessToken } from '../services/SecureStorage';
import { API_BASE_URL } from '../config/apiConfig';

// client api centralise
// ajoute le bearer token automatiquement quand il existe
class ApiClient {
  private readonly axiosInstance: AxiosInstance;

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

  // intercepteurs axios pour injecter le token et gerer les erreurs
  private setupInterceptors(): void {
    // requetes sortantes
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

    // reponses entrantes
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  // logs simples pour aider au debug
  private handleError(error: any): void {
    if (error.response) {
      console.error('Erreur API:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Aucune réponse du serveur:', error.request);
    } else {
      console.error('Erreur:', error.message);
    }
  }

  // get
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  // post
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  // put
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  // delete
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response.data;
  }
}

// instance unique
export const apiClient = new ApiClient();

// petit test de connexion utilise par l ecran de status
export const testApiConnection = async () => {
  try {
    // route simple cote api
    const data = await apiClient.get('/statuts/', { timeout: 5000 });
    console.log('✅ Connexion à l\'API réussie:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Échec de la connexion à l\'API:', error);
    // on renvoie un objet exploitable par l ui
    return {
      success: false,
      error: error.message,
      details: error.response ? `Status: ${error.response.status}` : 'Aucune réponse du serveur'
    };
  }
};
