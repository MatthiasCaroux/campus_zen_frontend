import { useState, useEffect } from "react";
import { getRessources } from "../services/RessourceProvider";
import Ressource from "../types/Ressource";

export function useRessources(): { ressources: Ressource[]; loading: boolean } {
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getRessources()
      .then((data) => setRessources(data || []))
      .finally(() => setLoading(false));
  }, []);

  return { ressources, loading };
}


