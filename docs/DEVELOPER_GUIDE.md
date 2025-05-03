# Guide Développeur VendingFinder

## 🛠️ Architecture

### Structure du Projet
```
app/
├── (tabs)/        # Navigation principale
├── (auth)/        # Routes d'authentification
├── details/       # Pages de détails
└── _layout.tsx    # Configuration racine

components/
├── ui/            # Composants génériques
├── map/           # Composants carte
└── forms/         # Composants formulaires

contexts/          # État global
hooks/             # Hooks personnalisés
types/             # Types TypeScript
```

### Contextes
- ThemeContext : Gestion du thème
- AuthContext : Authentification
- VendingMachineContext : Données distributeurs

### Navigation
- Tabs : Navigation principale
- Stack : Navigation secondaire
- Modals : Écrans superposés

## 📦 Base de Données

### Tables Supabase

#### distributeurs
```sql
create table distributeurs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  category text not null,
  average_price numeric,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### favoris
```sql
create table favoris (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  distributeur_id uuid references distributeurs,
  created_at timestamptz default now(),
  unique(user_id, distributeur_id)
);
```

### Politiques RLS
```sql
-- Lecture publique
create policy "Lecture publique des distributeurs"
on distributeurs for select
to anon
using (true);

-- Création authentifiée
create policy "Création par utilisateurs authentifiés"
on distributeurs for insert
to authenticated
with check (true);
```

## 🔄 État et Gestion des Données

### Flux de Données
1. Contexte → Hooks → Composants
2. Actions utilisateur → Contexte → Supabase
3. Mise à jour UI → Re-render optimisé

### Optimisations
- Mémoisation avec useMemo/useCallback
- Pagination des listes
- Mise en cache des images
- Gestion offline-first

## 📱 UI/UX

### Thème
- Couleurs dans ThemeContext
- Styles cohérents via StyleSheet
- Adaptation mode sombre/clair

### Composants
- Atomiques et réutilisables
- Props typées
- Documentation JSDoc

## 🔒 Sécurité

### Authentification
- Validation côté client/serveur
- Gestion des tokens
- Refresh automatique

### Données
- Validation des entrées
- Politiques RLS Supabase
- Sanitization des données

## 📦 Build et Déploiement

### Android
```bash
eas build --platform android --profile production
```

### iOS
```bash
eas build --platform ios --profile production
```

### Web
```bash
npm run build:web
```

## 🧪 Tests

### Tests Unitaires
```bash
npm run test
```

### Tests E2E
```bash
npm run test:e2e
```

## 📚 Ressources

- [Documentation Expo](https://docs.expo.dev)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation React Native](https://reactnative.dev/docs)