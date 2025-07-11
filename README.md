# VendingFinder - Localisateur de Distributeurs Automatiques

Application mobile permettant de localiser et référencer les distributeurs automatiques en France.

## 🚀 Fonctionnalités

- 🗺️ Carte interactive des distributeurs
- 🔍 Recherche et filtres par catégorie
- 📸 Ajout de distributeurs avec photos
- ⭐ Système de favoris et d'avis
- 🌙 Mode sombre
- 👤 Authentification (Google, email, invité)
- 📱 Interface responsive et intuitive

## 🛠️ Technologies

- React Native avec Expo
- Expo Router pour la navigation
- Supabase pour la base de données et l'authentification
- Google Maps pour la cartographie
- TypeScript pour la type-safety

## 📦 Installation

1. Cloner le repository :
```bash
git clone https://github.com/votre-username/vending-finder.git
cd vending-finder
```

2. Installer les dépendances :
```bash
npm install
```

3. Copier le fichier .env.example en .env et configurer les variables :
```bash
cp .env.example .env
```

4. Lancer l'application :
```bash
npm run dev
```

## 🔧 Configuration Supabase

1. Créer un projet sur [Supabase](https://supabase.com)
2. Configurer les tables suivantes :
   - distributeurs
   - favoris
   - avis
   - utilisateurs
3. Activer l'authentification et configurer les providers
4. Configurer le stockage pour les images

## 📱 Build et Déploiement

### Android

```bash
eas build --platform android
```

### iOS

```bash
eas build --platform ios
```

### Web

```bash
npm run build:web
```

## 🌍 Internationalisation

L'application est préparée pour la traduction dans plusieurs langues :
- 🇫🇷 Français (par défaut)
- 🇬🇧 Anglais
- 🇩🇪 Allemand
- 🇪🇸 Espagnol

## 📄 Documentation

- [Guide Utilisateur](./docs/USER_GUIDE.md)
- [Guide Développeur](./docs/DEVELOPER_GUIDE.md)
- [Guide Administration](./docs/ADMIN_GUIDE.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](./CONTRIBUTING.md) pour les directives.

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE.md](LICENSE.md) pour plus de détails.#   D i s t r i B Z  
 #   D i s t r i B Z  
 