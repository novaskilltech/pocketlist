# PocketList - Vos courses simplifiées 🛒

PocketList est une application moderne et intelligente de gestion de listes de courses, conçue pour simplifier l'organisation du foyer.

## 🚀 Fonctionnalités Clés

- **Mode Genius (IA)** : Utilisez la puissance de Google Gemini pour générer des listes intelligentes. Les utilisateurs peuvent connecter leur propre accès Gemini gratuit pour utiliser l'IA sans frais pour l'administrateur.
- **Mode Comité (Temps Réel)** : Collaborez en temps réel avec les membres de votre famille grâce aux WebSockets. Partagez un code unique et voyez les modifications instantanément.
- **Bibliothèque d'Essentiels** : Accédez à une large sélection de produits courants classés par catégories (Laiterie, Épicerie, Hygiène, Fruits & Légumes, Boulangerie).
- **Partage WhatsApp** : Envoyez votre liste d'articles manquants en un clic à vos proches.
- **Optimisé Mobile** : Une interface fluide et tactile pensée pour une utilisation au supermarché.
- **Abonnement Premium** : Intégration Stripe pour des fonctionnalités avancées et des listes illimitées.

## 🛠️ Stack Technique & Revue des Dépendances

L'application repose sur une stack robuste et moderne, garantissant stabilité et sécurité.

### Frontend
- **React 19** : Utilisation de la dernière version pour des performances optimales.
- **Vite 6** : Moteur de build ultra-rapide.
- **Tailwind CSS 4** : Design moderne et responsive avec le nouveau moteur haute performance.
- **Motion** : Animations fluides pour une expérience utilisateur premium.
- **Lucide React** : Iconographie claire et cohérente.

### Backend
- **Express 4.21** : Serveur Node.js stable et éprouvé.
- **Better-SQLite3** : Base de données locale ultra-rapide pour une gestion efficace des listes.
- **WebSockets (ws)** : Communication bidirectionnelle pour le Mode Comité en temps réel.
- **Zod** : Validation stricte des données pour une sécurité accrue.

### Intégrations
- **Google Gemini API (@google/genai)** : Intelligence artificielle pour le Mode Genius.
- **Stripe API** : Gestion sécurisée des paiements et abonnements.

## 📦 Installation et Développement

1. Installez les dépendances :
   ```bash
   npm install
   ```

2. Configurez les variables d'environnement dans un fichier `.env` :
   - `GEMINI_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## 🔒 Sécurité et Stabilité
- Validation des entrées avec Zod.
- Cookies sécurisés (HttpOnly, SameSite=None, Secure).
- Gestion robuste des erreurs API.
- Revue technique effectuée le 02/03/2026 confirmant la stabilité de l'écosystème open-source utilisé.
