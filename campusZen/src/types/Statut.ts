// Types pour les statuts et l'évolution de l'utilisateur

export interface Statut {
  idStatut: number;
  dateStatut: string;
  climat: number;
  personne: number;
}

export interface StatutWithClimat extends Statut {
  climatNom: string;
  climatScore: number;
}

// Mapping des climats vers des scores numériques pour le graphique
// Plus le score est élevé, meilleur est l'état mental
export const CLIMAT_SCORES: Record<string, number> = {
  'ensoleillé': 100,
  'vent frais': 80,
  'nuageux': 60,
  'quand le vent souffle': 40,
  'pluvieux': 20,
  // Support both naming variants: 'orageux' and 'tempête' map to the lowest score
  'orageux': 0,
  'tempête': 0,
};

// Couleurs associées aux climats pour le graphique
export const CLIMAT_COLORS: Record<string, string> = {
  'ensoleillé': '#FFD700',
  'vent frais': '#87CEEB',
  'nuageux': '#B0C4DE',
  'quand le vent souffle': '#778899',
  'pluvieux': '#4682B4',
  'orageux': '#2F4F4F',
  'tempête': '#2F4F4F',
};

export function getClimatScore(climatNom: string): number {
  const nom = climatNom.toLowerCase();
  return CLIMAT_SCORES[nom] ?? 50;
}

export function getClimatColor(climatNom: string): string {
  const nom = climatNom.toLowerCase();
  return CLIMAT_COLORS[nom] ?? '#666666';
}
