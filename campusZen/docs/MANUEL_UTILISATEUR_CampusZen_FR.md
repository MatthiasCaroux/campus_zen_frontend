# Manuel utilisateur — Campus Zen (FR)

Version : 1.0

## 1. Introduction

### 1.1 Présentation
Campus Zen est une application mobile dédiée au bien-être des étudiants et des membres de la communauté universitaire. Elle centralise des outils et ressources pour améliorer la santé mentale, émotionnelle et physique sur le campus.

### 1.2 Objectifs
- Faciliter l’accès à des événements liés au bien‑être (ateliers, conférences, séances)
- Mettre en relation les utilisateurs avec des ressources et des professionnels
- Proposer des questionnaires d’auto‑évaluation (stress, sommeil, etc.)
- Offrir un espace personnel pour suivre ses informations et résultats

## 2. Guide de prise en main

### 2.1 Installation
1. Ouvrez le Google Play Store (Android) ou l’App Store (iOS)
2. Recherchez « Campus Zen »
3. Appuyez sur Installer
4. Ouvrez l’application une fois l’installation terminée

*Capture d’écran (placeholder) : page du store*

### 2.2 Création d’un compte
1. Ouvrez l’application
2. Appuyez sur « Créer un compte »
3. Renseignez : nom, prénom, e‑mail, mot de passe
4. Acceptez les conditions d’utilisation et validez

*Capture d’écran (placeholder) : écran inscription — se référer à* [RegisterScreen.tsx](campusZen/screens/RegisterScreen.tsx#L1)

### 2.3 Connexion
1. Ouvrez l’application
2. Entrez votre e‑mail et mot de passe
3. Appuyez sur « Se connecter »

Voir l’écran de connexion : [LoginScreen.tsx](campusZen/screens/LoginScreen.tsx#L1)

### 2.4 Navigation générale
La navigation principale s’effectue via la barre d’onglets en bas (définie dans `MainTabs`):

- Accueil (`Accueil`) — flux principal et accès rapide
- Maps (`Maps`) — carte et professionnels
- Ressources (`Ressources`) — articles, vidéos, podcasts, contacts
- Questionnaire (`Questionnaire`) — listes de questionnaires
- Compte (`Compte`) — profil et préférences

Référence code : [MainTabs.tsx](campusZen/MainTabs.tsx#L1)

## 3. Fonctionnalités détaillées

### 3.1 Calendrier d’événements
Description : visualisez les événements bien‑être du campus.

Étapes :
1. Appuyez sur l’onglet correspondant (si votre version affiche un calendrier)
2. Parcourez par date
3. Sélectionnez un événement pour voir : titre, description, date, lieu, intervenant

Écran : [CalendrierScreen.tsx](campusZen/screens/CalendrierScreen.tsx#L1)

### 3.2 Ressources et professionnels
Description : section regroupant ressources (articles, vidéos, podcasts) et fiches de professionnels.

Fonctionnalités clés :
- Recherche et filtres par type (Articles, Vidéos, Podcasts, etc.)
- Ouverture de liens externes vers la ressource
- Pour les administrateurs : création et modification de ressources

Étapes :
1. Appuyez sur `Ressources` dans la barre d’onglets
2. Utilisez la barre de recherche pour filtrer
3. Sélectionnez une ressource pour ouvrir le lien ou afficher les détails
4. (Admin) Appuyez sur l’icône + pour ajouter/modifier une ressource

Écran : [RessourcesScreen.tsx](campusZen/screens/RessourcesScreen.tsx#L1)

Remarque : le bouton d’ajout est visible uniquement si le rôle utilisateur est `admin` (voir la logique dans `RessourcesScreen`).

### 3.3 Questionnaires
Description : liste des questionnaires disponibles pour auto‑évaluation.

Étapes :
1. Appuyez sur l’onglet `Questionnaire`
2. Choisissez un questionnaire dans la liste
3. Répondez aux questions, puis validez pour afficher les résultats

Écran : [QuestionnaireScreen.tsx](campusZen/screens/QuestionnaireScreen.tsx#L1)

Après sélection d’un questionnaire, les questions sont affichées via l’écran `Questions` (navigation héritée de `QuestionnaireStack`).

### 3.4 Consulter les résultats
Après validation, l’application affiche : score global, interprétation et recommandations. L’historique des résultats est accessible depuis l’espace personnel si implémenté.

Écran lié : `ConsultEtat` (label « Mon état ») — voir [MainTabs.tsx](campusZen/MainTabs.tsx#L1)

### 3.5 Gestion du profil
Description : mettez à jour vos informations personnelles et préférences.

Étapes :
1. Ouvrez `Compte` dans la barre d’onglets
2. Modifiez nom, e‑mail, mot de passe
3. Gérez les notifications
4. Enregistrez

Fichier source : [CompteScreen.tsx](campusZen/screens/CompteScreen.tsx#L1)

## 4. FAQ (questions fréquentes)

Q : J’ai oublié mon mot de passe
A : Depuis l’écran de connexion, utilisez « Mot de passe oublié » et suivez les instructions envoyées par e‑mail.

Q : Je n’arrive pas à me connecter
A : Vérifiez votre connexion Internet, vos identifiants, ou réinitialisez votre mot de passe.

Q : Les événements ou ressources ne s’affichent pas
A : Assurez‑vous que l’application est à jour, redémarrez l’app et réessayez. Si le problème persiste, contactez le support.

## 5. Lexique
- Compte utilisateur : espace personnel associé à un utilisateur
- Questionnaire : série de questions d’auto‑évaluation
- Ressource : contenu informatif (article, vidéo, podcast)
- Professionnel : fiche contact d’un intervenant ou prestataire
- Notification : message envoyé pour informer l’utilisateur

## 6. Support et contact
Pour toute question technique ou signalement :

- E‑mail : support@campuszen.app
- Formulaire de contact : via l’application (écran `Compte` ou page de support si présente)

---

Remarques pour l’édition technique
- Ce manuel a été adapté en se basant sur les écrans et labels présents dans le code : [MainTabs.tsx](campusZen/MainTabs.tsx#L1), [LoginScreen.tsx](campusZen/screens/LoginScreen.tsx#L1), [RessourcesScreen.tsx](campusZen/screens/RessourcesScreen.tsx#L1), [QuestionnaireScreen.tsx](campusZen/screens/QuestionnaireScreen.tsx#L1), [CalendrierScreen.tsx](campusZen/screens/CalendrierScreen.tsx#L1).
- Pour ajouter de vraies captures d’écran : effectuer des captures sur un émulateur ou appareil, nommer les fichiers, puis remplacer les placeholders par les images dans la documentation.

© Campus Zen
