# Guide d'installation - CampusZen Frontend

## Prérequis système

### 1. Node.js et npm
- **Node.js** version 18 ou supérieure
- **npm** (inclus avec Node.js) ou **yarn**

Vérifiez votre installation :
```bash
node --version
npm --version
```

### 2. Expo CLI
Installation globale d'Expo CLI :
```bash
npm install -g @expo/cli
```

### 3. Git
Git est nécessaire pour cloner le repository.

## Installation du projet

### 1. Cloner le projet
```bash
git clone <url-du-repository>
cd campus_zen_frontend
```

### 2. Installer les dépendances
```bash
cd campusZen
npm install
```

### 3. Démarrer le projet
```bash
npm start
```

## Outils de développement (optionnels)

### Pour le développement mobile

#### Option 1 : Appareil physique
- Installer l'application **Expo Go** depuis :
  - [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)

#### Option 2 : Émulateurs
- **Android Studio** (pour émulateur Android)
- **Xcode** (pour simulateur iOS - Mac uniquement)

### Tunneling (optionnel)
Si vous avez des problèmes de réseau :
```bash
npm install -g @expo/ngrok@^4.1.0
```

## Scripts disponibles

```bash
npm start          # Démarrer le serveur de développement
npm run android    # Lancer sur Android
npm run ios        # Lancer sur iOS (Mac uniquement)
npm run web        # Lancer sur navigateur web
```

## Dépendances principales

- **Framework** : Expo ~54.0.10
- **React** : 19.1.0
- **React Native** : 0.81.4
- **Navigation** : React Navigation v7
- **TypeScript** : ~5.9.2

## Structure du projet

```
campusZen/
├── src/
│   ├── components/
│   ├── screens/
│   ├── types/
│   └── utils/
├── App.tsx
├── tsconfig.json
└── package.json
```

## Dépannage

### Problèmes courants

1. **Erreur de port** : Si le port 8081 est occupé
   ```bash
   npx expo start --port 8082
   ```

2. **Cache corrompu** : Nettoyer le cache
   ```bash
   npx expo start --clear
   ```

3. **Problèmes de dépendances** : Réinstaller les node_modules
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Support

Pour toute question ou problème, consultez la [documentation Expo](https://docs.expo.dev/) ou créez une issue dans le repository.