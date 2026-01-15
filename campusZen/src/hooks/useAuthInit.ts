import { useEffect, useState } from "react";
import { getStoredUser } from "../services/AuthService";
import { useTokenRefresh } from "./useTokenRefresh";

interface UseAuthInitProps {
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
}

/**
 * Hook pour gérer l'initialisation de l'authentification au démarrage de l'application
 * Vérifie la validité des tokens et rafraîchit si nécessaire
 */
export const useAuthInit = ({ setIsAuthenticated, logout }: UseAuthInitProps) => {
  const [user, setUser] = useState<any>(null);
  const { handleTokenRefresh } = useTokenRefresh();

  useEffect(() => {
    const initializeAuth = async () => {
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

      // Vérification de l'expiration du token de rafraîchissement
      if (now >= endRefresh) {
        console.log("Le token de rafraîchissement a expiré. Veuillez vous reconnecter.");
        logout();
        return;
      }

      // Vérification de l'expiration du token d'accès
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
