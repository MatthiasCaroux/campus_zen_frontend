import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshToken } from "../services/AuthService";
import { getRefreshToken, setAccessToken } from "../services/SecureStorage";
import { TOKEN_CONFIG } from "../constants/tokenConfig";

// hook pour refresh le access token
export const useTokenRefresh = () => {
  // renvoie true si on a pu regenerer un access token
  const handleTokenRefresh = async (userData: any): Promise<boolean> => {
    const tokenRefresh = await getRefreshToken();
    
    if (!tokenRefresh) {
      console.log("Aucun token de rafraîchissement trouvé. Veuillez vous reconnecter.");
      return false;
    }

    try {
      const newAccessToken = await refreshToken(tokenRefresh);
      
      if (newAccessToken.access) {
        // on met a jour le token et la nouvelle date de fin access
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
