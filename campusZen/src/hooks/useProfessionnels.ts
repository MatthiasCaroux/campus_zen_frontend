import { useState, useEffect } from "react";
import { getProfessionnels } from "../services/ProfessionnelProvider";
import Professionnel from "../types/Professionnel";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

export function useProfessionnels(): { professionnels: Professionnel[]; loading: boolean; refresh: () => void } {
  const [professionnels, setProfessionnels] = useState<Professionnel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadRessources = async () => {
    setLoading(true);
    try {
      const data = await getProfessionnels();
      setProfessionnels(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des professionnels:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadRessources();
    }, [])
  );

  return { professionnels, loading, refresh: loadRessources };
}


