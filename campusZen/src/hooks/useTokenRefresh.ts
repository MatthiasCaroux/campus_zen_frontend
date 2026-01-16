import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshToken } from "../services/AuthService";
import { getRefreshToken, setAccessToken } from "../services/SecureStorage";
import { TOKEN_CONFIG } from "../constants/tokenConfig";

/**
 * Hook pour gérer le rafraîchissement des tokens d'authentification
 */
export const useTokenRefresh = () => {
  /**
   * Rafraîchit le token d'accès en utilisant le token de rafraîchissement
   * @param userData - Données utilisateur stockées
   * @returns true si le rafraîchissement a réussi, false sinon
   */
  const handleTokenRefresh = async (userData: any): Promise<boolean> => {
    const tokenRefresh = await getRefreshToken();
    
    if (!tokenRefresh) {
      console.log("Aucun token de rafraîchissement trouvé. Veuillez vous reconnecter.");
      return false;
    }

    try {
      const newAccessToken = await refreshToken(tokenRefresh);
      
      if (newAccessToken.access) {
        await setAccessToken(newAccessToken.access);
        await AsyncStorage.setItem("user", JSON.stringify({
          ...userData,
          endAccess: new Date(Date.now() + TOKEN_CONFIG.ACCESS_TOKEN_DURATION),
        }));
        console.log("Token d'accès rafraîchi avec succès.");
        return true;
      } else {
        console.log("Échec du rafraîchissement du token d'accès. Veuillez vous reconnecter.");
        return false;
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token:", error);
      return false;
    }
  };

  return { handleTokenRefresh };
};
