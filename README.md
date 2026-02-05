# Campus Zen - Frontend Mobile

<div align="center">

**Application mobile** pour la plateforme Campus Zen

[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](../LICENSE)

</div>

## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [Configuration API](#️-configuration-api)
- [Dépannage](#-dépannage)

## 🎯 Aperçu

Campus Zen Frontend est une **application mobile cross-platform** (iOS/Android) permettant aux étudiants de :

✅ Se connecter de manière sécurisée  
✅ Répondre à des questionnaires interactifs  
✅ Voir leurs résultats personnalisés  
✅ Accéder aux ressources recommandées  
✅ Consulter la liste des professionnels de santé  
✅ Bénéficier d'une interface intuitive et accessible  

### Stack technologique

```
┌─────────────────────────────────┐
│   React Native (0.81)           │  Framework mobile
├─────────────────────────────────┤
│   TypeScript                    │  Typage statique
├─────────────────────────────────┤
│   Expo (54)                     │  Plateforme dev
├─────────────────────────────────┤
│   React Navigation              │  Navigation
├─────────────────────────────────┤
│   Axios + SecureStore           │  API & Données
└─────────────────────────────────┘
```

## 📦 Prérequis

### Requis
- **Node.js** 18+ et **npm** ou **yarn**
- **Expo CLI** : `npm install -g expo-cli`
- **Git**

### Pour développement natif
- **Xcode** (macOS - pour iOS)
- **Android Studio** (pour Android)
- **Emulateur Android** ou **Simulateur iOS**

### Pour test rapide
- **Expo Go** app sur votre téléphone (iOS/Android)

### Vérifier les prérequis

```bash
node --version      # Doit être 18+
npm --version
expo --version
```

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <URL-du-repository>
cd campus_zen_frontend/campusZen
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

### 3. Lancer l'application

Pour tester l'application, utiliser la commande tunnel d'Expo :

```bash
npx expo start --tunnel
```

Ceci démarre le serveur Expo avec un tunnel sécurisé permettant de tester sur votre appareil mobile même sans être sur le même réseau.

## 📱 Utilisation

### Démarrage de l'application

```bash
# Méthode recommandée avec tunnel
npx expo start --tunnel
```

Une fois le serveur démarré, choisir la plateforme :
- **Android** : Appuyer sur `a` dans le terminal
- **iOS** : Appuyer sur `i` dans le terminal (macOS uniquement)
- **Web** : Appuyer sur `w` dans le terminal
- **Expo Go** : Scannez le QR code avec l'app Expo Go

## 📁 Structure du projet

```
campusZen/
├── src/
│   ├── screens/                 # 📱 Écrans de l'application
│   ├── components/              # 🔧 Composants réutilisables
│   ├── navigation/              # 🗺️ Navigation
│   ├── api/                     # 🌐 Client API
│   │   ├── apiClient.ts
│   │   ├── questionnaires.ts
│   │   ├── auth.ts
│   │   ├── resources.ts
│   │   └── professionals.ts
│   │
│   ├── types/                   # 📝 Types TypeScript
│   │   ├── index.ts
│   │   ├── api.ts
│   │   └── models.ts
│   │
│   ├── hooks/                   # 🎣 Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useQuestionnaire.ts
│   │   └── useApi.ts
│   │
│   ├── context/                 # 🔄 Context API
│   │   ├── AuthContext.tsx
│   │   └── AppContext.tsx
│   │
│   ├── utils/                   # 🛠️ Utilitaires
│   │   ├── storage.ts
│   │   ├── formatting.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   │
│   ├── styles/                  # 🎨 Styles globaux
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── theme.ts
│   │
│   ├── assets/                  # 📦 Ressources
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── App.tsx                  # 📍 Point d'entrée
│   └── index.ts
│
├── .devcontainer/               # 🐳 Dev container (VS Code)
├── android/                     # 🤖 Configuration Android
├── app.json                     # Configuration Expo
├── eas.json                     # EAS Build config
├── tsconfig.json                # Configuration TypeScript
├── package.json
├── metro.config.js
├── eslint.config.js
├── .prettierrc
└── .gitignore
```

## ⚙️ Configuration API

L'application communique avec le backend Django via Axios. L'URL API est configurée en dur dans `src/config/apiConfig.ts` et définie à `https://incidents-bouake.com/api/` (ou `http://localhost:8000/api` pour le développement).

Les tokens JWT sont automatiquement gérés :
- Sur mobile natif : Stockés dans SecureStore et envoyés via Bearer token
- Sur web : Cookies HttpOnly envoyés automatiquement

## 🔐 Authentification

### Flux d'authentification

1. User entre les identifiants
2. API retourne les tokens (access + refresh)
3. Tokens stockés de manière sécurisée dans Secure Store
4. Token envoyé automatiquement avec chaque requête
5. Refresh automatique si le token expire

Un contexte d'authentification est fourni pour accéder aux informations utilisateur dans toute l'application.

## 📱 Fonctionnalités principales

### 1. Authentification

- ✅ Connexion sécurisée
- ✅ Stockage sécurisé des tokens (SecureStore)
- ✅ Refresh automatique des tokens
- ✅ Déconnexion sécurisée

### 2. Questionnaires

- ✅ Liste des questionnaires disponibles
- ✅ Navigation intuitive entre les questions
- ✅ Système de score Likert (1-7)
- ✅ Sauvegarde automatique de la progression
- ✅ Validation des réponses

### 3. Résultats

- ✅ Affichage du score total et pourcentage
- ✅ Interprétation du "climat" (état émotionnel)
- ✅ Message d'encouragement personnalisé
- ✅ Historique des résultats

### 4. Ressources

- ✅ Liste de ressources recommandées
- ✅ Filtrage par type (article, vidéo, etc.)
- ✅ Ouverture des liens externes
- ✅ Sauvegarde des favoris

### 5. Professionnels

- ✅ Localisation GPS des professionnels
- ✅ Filtrage par proximité
- ✅ Affichage des détails de contact
- ✅ Appel/Email direct

## 🧪 Tests & Qualité

- **Linting** : ESLint pour vérifier la qualité du code
- **Formatting** : Prettier pour le formatage automatique
- **Tests unitaires** : À ajouter avec Jest/Testing Library

## 🔧 Dépannage

### Problème : Port 8081 déjà utilisé

Pour lancer sur un autre port, modifier la configuration Expo.

### Problème : Expo Go ne se connecte pas

Vérifier que le téléphone et le PC sont sur le même réseau.

### Problème : Erreur de compilation React Native

## 📚 Ressources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Axios Docs](https://axios-http.com/)

## Auteurs
- Enzo Familiar-Marais
- Matthias Caroux
- Niksan Nagarajah
- Samuel Niveau

## 📝 License

MIT - Voir [LICENSE](../LICENSE)

