# Architecture de Navigation - CampusZen

## Structure Hiérarchique

```
AppNavigator (Root)
├── Non authentifié
│   └── AuthStackNavigator
│       ├── Login
│       └── Register
│
└── Authentifié
    └── TabNavigator (Bottom Tabs)
        ├── Home Tab
        │   └── HomeStackNavigator
        │       ├── HomeMain
        │       ├── Questionnaire
        │       ├── Questions
        │       └── ConsultEtat
        │
        ├── Maps Tab
        │   └── MapsStackNavigator
        │       ├── MapsMain
        │       └── ProDetailsScreen
        │
        ├── Ressources Tab
        │   └── RessourcesStackNavigator
        │       └── RessourcesMain
        │
        └── Compte Tab
            └── CompteStackNavigator
                └── CompteMain
```

## Fichiers de Navigation

### Navigation Racine
- **AppNavigator.tsx** : Point d'entrée principal, gère l'authentification

### Navigation Principale
- **TabNavigator.tsx** : Bottom tabs avec 4 onglets principaux

### Stacks d'Authentification
- **AuthStackNavigator.tsx** : Login et Register

### Stacks des Onglets
- **HomeStackNavigator.tsx** : Navigation de l'accueil et questionnaires
- **MapsStackNavigator.tsx** : Navigation de la carte et détails pro
- **RessourcesStackNavigator.tsx** : Navigation des ressources
- **CompteStackNavigator.tsx** : Navigation du compte utilisateur

## Avantages de cette Architecture

1. **Séparation claire** : Chaque stack est dans son propre fichier
2. **Hiérarchie propre** : Tabs → Stacks → Screens
3. **Scalabilité** : Facile d'ajouter de nouveaux écrans dans chaque stack
4. **Navigation cohérente** : Chaque tab a son propre historique de navigation
5. **Maintenabilité** : Code organisé et facile à comprendre


