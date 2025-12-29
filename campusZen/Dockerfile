# Utiliser l'image Node.js officielle comme base
FROM node:18

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    git \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Créer et définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Installer Expo CLI et ngrok globalement
RUN npm install -g @expo/ngrok@^4.1.0 expo-cli

# Copier le reste des fichiers du projet
COPY . .

# Exposer les ports utilisés par Expo
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Commande par défaut pour démarrer Expo
CMD ["npx", "expo", "start"]
