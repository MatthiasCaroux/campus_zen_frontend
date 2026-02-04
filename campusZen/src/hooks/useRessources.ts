import { useState, useEffect } from "react";
import { getRessources } from "../services/RessourceProvider";
import Ressource from "../types/Ressource";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

export function useRessources(): { ressources: Ressource[]; loading: boolean; refresh: () => void } {
  // hook qui charge les ressources et propose un refresh
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadRessources = async () => {
    setLoading(true);
    try {
      const data = await getRessources();
      setRessources(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des ressources:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // recharge quand l ecran est focus
      loadRessources();
    }, [])
  );

  return { ressources, loading, refresh: loadRessources };
}


