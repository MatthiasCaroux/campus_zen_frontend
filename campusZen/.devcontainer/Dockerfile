FROM node:18

RUN apt-get update && apt-get install -y \
    git \
    sudo \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g @expo/ngrok@^4.1.0 expo-cli

WORKDIR /app

EXPOSE 8081 19000 19001 19002

CMD ["npx", "expo", "start", "--tunnel"]
