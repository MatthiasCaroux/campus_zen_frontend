import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { getStoredUser } from "../services/AuthService";
import { useTokenRefresh } from "./useTokenRefresh";

interface UseAuthInitProps {
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
}

// hook lance au demarrage
// verifie les dates endAccess endRefresh et refresh si besoin
export const useAuthInit = ({ setIsAuthenticated, logout }: UseAuthInitProps) => {
  const [user, setUser] = useState<any>(null);
  const { handleTokenRefresh } = useTokenRefresh();
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    const initializeAuth = async () => {
      // sur web: la vérification d'auth est gérée par AuthContext via appel API
      // on ne fait rien ici pour éviter les conflits
      if (isWeb) {
        return;
      }

      // on recupere le user du storage
      const userData = await getStoredUser();
      
      if (!userData) {
        return;
      }

      setUser(userData);
      console.log("Vérification des tokens pour l'utilisateur");

      if (!userData.endRefresh) {
        setIsAuthenticated(false);
        return;
      }

      const now = new Date();
      const endAccess = new Date(userData.endAccess);
      const endRefresh = new Date(userData.endRefresh);

      // si refresh expire on force une reconnexion
      if (now >= endRefresh) {
        console.log("Le token de rafraîchissement a expiré. Veuillez vous reconnecter.");
        logout();
        return;
      }

      // si access expire on tente un refresh
      if (now >= endAccess) {
        const refreshSuccess = await handleTokenRefresh(userData);
        setIsAuthenticated(refreshSuccess);
      } else {
        console.log("Les tokens sont valides. L'utilisateur est authentifié.");
        setIsAuthenticated(true);
      }
    };

    initializeAuth();
  }, []);

  return { user };
};
