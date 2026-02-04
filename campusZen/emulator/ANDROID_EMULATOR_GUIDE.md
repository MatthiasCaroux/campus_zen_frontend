# Guide d'utilisation de l'émulateur Android avec VSCode

## Configuration terminée ! 🎉

Votre environnement Android SDK est maintenant configuré sans Android Studio.

### Ce qui a été installé

- ✅ Java 17 (OpenJDK)
- ✅ Android SDK Command Line Tools
- ✅ Android Platform Tools (adb, etc.)
- ✅ Android Emulator
- ✅ Android 14 (API 34) System Image
- ✅ Émulateur virtuel "Pixel_7_API_34"

### Variables d'environnement configurées

- `ANDROID_HOME`: `C:\Android`
- `JAVA_HOME`: `C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot`
- `PATH`: Mis à jour avec les outils Android et Java

**⚠️ Important**: Redémarrez VSCode pour que les nouvelles variables d'environnement soient prises en compte.

---

## 🚀 Comment lancer l'émulateur

### Option 1 : Depuis VSCode (Recommandé)

1. Appuyez sur `Ctrl+Shift+P`
2. Tapez "Tasks: Run Task"
3. Sélectionnez **"Start Android Emulator"**

L'émulateur va s'ouvrir dans une fenêtre séparée.

### Option 2 : En ligne de commande

Ouvrez un nouveau terminal dans VSCode et lancez :

```bash
emulator -avd Pixel_7_API_34
```

### Option 3 : Via script rapide

Double-cliquez sur le fichier qu'on peut créer :

```bash
# start_emulator.bat
@echo off
C:\Android\emulator\emulator.exe -avd Pixel_7_API_34
```

---

## 📱 Comment lancer votre app React Native/Expo

### Avec Expo (votre projet)

1. Lancez l'émulateur (Option 1, 2 ou 3 ci-dessus)
2. Dans un nouveau terminal VSCode :

```bash
cd campusZen
npm start
```

3. Dans le terminal Expo, appuyez sur `a` pour lancer sur Android

### Ou directement avec la commande Android

1. Lancez l'émulateur
2. Dans VSCode terminal :

```bash
cd campusZen
npm run android
```

---

## 🔧 Commandes utiles

### Vérifier que l'émulateur est détecté

```bash
adb devices
```

Devrait afficher votre émulateur connecté.

### Lister les AVDs disponibles

```bash
emulator -list-avds
```

### Créer un nouvel émulateur

```bash
avdmanager create avd -n MonEmulateur -k "system-images;android-34;google_apis;x86_64" -d pixel_7
```

---

## 🌐 Utilisation avec Remote Tunnel VSCode

### Si vous utilisez Remote Tunnel

Les variables d'environnement sont configurées dans `.vscode/settings.json` pour que le terminal VSCode les charge automatiquement.

**Important** : L'émulateur s'exécutera sur le PC Windows (serveur), pas sur votre PC client. Vous verrez l'émulateur dans une fenêtre sur le PC Windows.

### Solutions pour voir l'émulateur à distance

1. **Chrome Remote Desktop** (gratuit, recommandé)
   - Installez l'extension Chrome "Chrome Remote Desktop"
   - Configurez l'accès distant
   - Connectez-vous depuis votre PC portable

2. **RDP Windows** (intégré à Windows Pro)
   - Activez Bureau à distance dans Windows
   - Connectez-vous via l'adresse IP du PC

3. **ADB via réseau** (pour développement uniquement)
   - L'app se connecte à Metro Bundler via le réseau
   - L'émulateur reste sur le PC Windows

---

## 🐛 Dépannage

### L'émulateur ne démarre pas

1. Vérifiez la virtualisation (BIOS → Intel VT-x ou AMD-V activé)
2. Vérifiez que HAXM est installé :

```bash
sdkmanager --install "extras;intel;Hardware_Accelerated_Execution_Manager"
```

### ADB ne voit pas l'émulateur

```bash
adb kill-server
adb start-server
adb devices
```

### L'app ne se connecte pas

Dans l'émulateur, configurez le serveur Metro :

```bash
adb reverse tcp:8081 tcp:8081
```

---

## 📚 Ressources

- [Documentation Expo](https://docs.expo.dev/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [Android Emulator Guide](https://developer.android.com/studio/run/emulator-commandline)

---

**Fait avec Claude Code** 🤖
