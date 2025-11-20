import { useState, useEffect } from "react";
import { getProfessionnels } from "../services/ProfessionnelProvider";
import Professionnel from "../types/Professionnel";

export function useProfessionnels(): { professionnels: Professionnel[]; loading: boolean } {
  const [professionnels, setProfessionnels] = useState<Professionnel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getProfessionnels()
      .then((data) => setProfessionnels(data || []))
      .finally(() => setLoading(false));
  }, []);

  return { professionnels, loading };
}


