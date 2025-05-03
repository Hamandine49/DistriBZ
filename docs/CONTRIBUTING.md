# Guide de Contribution

Merci de contribuer à VendingFinder ! Voici quelques directives pour vous aider.

## Process de Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Standards de Code

- Utiliser TypeScript
- Suivre les conventions ESLint/Prettier du projet
- Ajouter des tests pour les nouvelles fonctionnalités
- Documenter le code avec des commentaires JSDoc
- Suivre les principes SOLID

## Structure du Projet

```
src/
├── app/           # Routes Expo Router
├── components/    # Composants réutilisables
├── contexts/      # Contextes React
├── hooks/         # Hooks personnalisés
├── services/      # Services (API, etc.)
└── types/         # Types TypeScript
```

## Commits

Format : `type(scope): description`

Types :
- feat: Nouvelle fonctionnalité
- fix: Correction de bug
- docs: Documentation
- style: Formatage
- refactor: Refactoring
- test: Tests
- chore: Maintenance

## Tests

```bash
npm run test
```

## Documentation

- Documenter les nouvelles fonctionnalités
- Mettre à jour le README si nécessaire
- Ajouter des commentaires pour le code complexe