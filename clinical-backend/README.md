# Backend - Surveillance de Santé à Distance

## Description
Ce dossier contient l'API du projet **Surveillance de Santé à Distance et Assistance au Diagnostic**, développée avec **Node.js** et **Express**.

## Installation
### 1. Cloner le projet
```sh
git clone https://github.com/Jackfm54/Clinical-backend-ia.git
cd Clinical-backend-ia/clinical-backend
```

### 2. Installer les dépendances
```sh
npm install
```

## Configuration
Créer un fichier `.env` à la racine du backend et ajouter les variables suivantes :
```env
PORT=5001
MONGO_URI=votre_url_mongodb
JWT_SECRET=secret_key
```

## Démarrage du Serveur
```sh
npm start
```

Le serveur démarrera sur `http://localhost:5001`.

## Endpoints Principaux
| Méthode | Endpoint            | Description |
|---------|--------------------|-------------|
| POST    | `/api/health-data/` | Sauvegarder les données de santé |
| GET     | `/api/health-data/:userId` | Récupérer les données de santé d'un utilisateur |
| POST    | `/api/ai/classify` | Classification des risques de santé par IA |
| POST    | `/api/ai/predict` | Prédiction des risques de santé |
| POST    | `/api/chat/` | Obtenir une réponse du chatbot médical |
| POST    | `/api/users/` | Inscription d'un utilisateur (avec image et voix) |
| GET     | `/api/users/` | Récupérer la liste des utilisateurs |
| POST    | `/api/users/login` | Authentification d'un utilisateur |

## Technologies Utilisées
- Node.js
- Express
- MongoDB (Mongoose)
- JSON Web Token (JWT) pour l'authentification

## Contribution
Les contributions sont les bienvenues !
1. Forkez le projet
2. Créez une branche (`git checkout -b feature-nouvelle-fonctionnalité`)
3. Faites vos modifications et validez (`git commit -m "Ajout d'une nouvelle fonctionnalité"`)
4. Poussez votre branche (`git push origin feature-nouvelle-fonctionnalité`)
5. Ouvrez une **pull request**

## Contact
Pour toute question ou suggestion, veuillez ouvrir une **issue** sur GitHub.
