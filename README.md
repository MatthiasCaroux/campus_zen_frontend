# Campus Zen - Frontend

Application mobile React Native développée avec Expo et TypeScript pour le projet Campus Zen.

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Expo CLI
- Un émulateur Android/iOS ou l'application Expo Go sur votre téléphone

## 🚀 Installation

1. **Cloner le repository**
   ```bash
   git clone <url-du-repo>
   cd campus_zen_frontend
   ```

2. **Installer les dépendances**
   ```bash
   cd campusZen
   npm install
   ```

3. **Installer Expo ngrok (si nécessaire)**
   ```bash
   sudo npm install --global @expo/ngrok@^4.1.0
   ```

## 🏃 Lancement de l'application

- **Démarrer le serveur de développement**
  ```bash
  npx expo start
  ```

- **Lancer sur Android**
  ```bash
  npm run android
  ```

- **Lancer sur iOS**
  ```bash
  npm run ios
  ```

- **Lancer sur le web**
  ```bash
  npm run web
  ```

## 📁 Structure du projet

```
campusZen/
├── screens/          # Écrans de l'application
├── config/           # Configuration de l'application
├── assets/           # Images, fonts, etc.
├── App.tsx           # Point d'entrée de l'application
├── index.ts          # Index principal
├── tsconfig.json     # Configuration TypeScript
└── package.json      # Dépendances du projet
```

## 🛠️ Technologies utilisées

- **React Native** - Framework mobile
- **Expo** - Plateforme de développement
- **TypeScript** - Typage statique
- **React Navigation** - Navigation entre les écrans
- **Axios** - Requêtes HTTP vers l'API
- **Expo Linear Gradient** - Dégradés de couleurs

## 🔗 API

L'application se connecte à l'API Backend de Campus Zen pour récupérer et envoyer des données.

## Pour se connecter au serveur via ssh : 

```
ssh ubuntu@54.38.35.105
```