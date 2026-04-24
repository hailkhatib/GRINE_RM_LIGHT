# 🚀 Configuration de l'automatisation GitHub -> Netlify

Ce projet est configuré pour déployer automatiquement vos 3 versions (**Light**, **Advanced**, **Premium**) chaque fois que vous envoyez du code sur la branche `main`.

## 1. Création des sites sur Netlify
Pour que cela fonctionne, vous devez créer 3 sites distincts sur votre compte Netlify :
1. Connectez-vous sur [app.netlify.com](https://app.netlify.com).
2. Créez 3 nouveaux sites (même vides au départ).
3. Notez l'**API ID** de chaque site (disponible dans *Site settings > Site details > Site information*).

## 2. Obtention du Token Netlify
1. Allez dans vos [User Settings > Applications > Personal access tokens](https://app.netlify.com/user/settings/applications#personal-access-tokens).
2. Cliquez sur **New access token** et nommez-le "GitHub Actions".
3. Copiez le jeton généré.

## 3. Configuration des Secrets sur GitHub
Allez sur votre dépôt GitHub, puis dans **Settings > Secrets and variables > Actions**. 
Ajoutez les 4 secrets suivants :

| Secret Name | Valeur |
| :--- | :--- |
| `NETLIFY_AUTH_TOKEN` | Votre Personal Access Token (étape 2) |
| `NETLIFY_SITE_ID_LIGHT` | L'API ID du site Light |
| `NETLIFY_SITE_ID_ADVANCED` | L'API ID du site Advanced |
| `NETLIFY_SITE_ID_PREMIUM` | L'API ID du site Premium |

## 4. Fonctionnement
Dès que ces secrets sont configurés, tout `git push` sur la branche `main` déclenchera la compilation et le déploiement des 3 versions automatiquement. Vous pouvez suivre l'avancée dans l'onglet **Actions** de GitHub.
