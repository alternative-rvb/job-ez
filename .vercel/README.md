# Déploiement Vercel pour Job Ready Quiz

## Build Process

Le projet utilise un `buildCommand` personnalisé qui génère automatiquement l'index des quiz disponibles :

```bash
python3 api.py generate-index
```

## Structure des fichiers

- `js/data/index.json` - Index généré automatiquement des quiz disponibles
- `js/data/*.json` - Fichiers individuels des quiz
- `api/generate-index.py` - API Vercel pour regénération dynamique (optionnel)

## Cache Strategy

- Fichiers statiques (JS, CSS, images) : Cache 1 an
- Données JSON : Cache 1 heure
- Index : Regénéré à chaque build

## Variables d'environnement

Aucune variable d'environnement requise pour le moment.

## Déploiement

1. Push vers main
2. Vercel détecte automatiquement les changements
3. Execute le buildCommand pour générer l'index
4. Déploie les fichiers statiques

## Debug

En cas de problème, vérifiez :
- `js/data/index.json` existe et contient tous les quiz
- Tous les fichiers JSON dans `js/data/` ont une structure valide
- Les logs de build Vercel pour d'éventuelles erreurs Python