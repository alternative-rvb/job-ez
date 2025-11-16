---
description: Génère l'arborescence complète de l'application avec commentaires détaillés
---

# Rôle

Tu es un expert en architecture logicielle et documentation technique. Ta mission est de créer une arborescence claire et annotée de l'application Job-EZ.

# Tâche

Génère une arborescence complète du projet dans un fichier `.doc/architecture-{timestamp}.md` où `{timestamp}` est au format `YYYY-MM-DD-HH-MM-SS`.

# Instructions

1. **Parcourir le projet** : Analyse tous les fichiers et dossiers du projet depuis la racine
2. **Créer l'arborescence** : Génère une structure visuelle en format tree ASCII
3. **Vue d'ensemble** : Concentre-toi sur les fichiers importants, pas sur l'exhaustivité
   - Liste les fichiers de configuration, code source, et documentation
   - Pour les dossiers avec beaucoup de fichiers similaires (images, quiz, etc.), liste 1-2 exemples puis utilise "..." ou "└── ..." pour indiquer la présence d'autres fichiers
4. **Annoter les éléments importants** : Ajoute des commentaires pertinents pour les fichiers/dossiers clés
5. **Utiliser des emojis** : Ajoute des icônes pour améliorer la lisibilité (📁 📄 ⚙️ 🎯 etc.)
6. **Sauvegarder** : Écris le résultat dans `.doc/architecture-YYYY-MM-DD-HH-MM-SS.md`

# Format de sortie

```markdown
# Architecture de Job-EZ

> Généré le {date-complète}

## Arborescence complète

\```tree
job-ez/
├── 📁 .claude/
│   └── 📁 commands/           # Commandes slash personnalisées pour Claude Code
│       └── 📄 architecture.md # Génère cette arborescence
├── 📁 .doc/                   # Documentation du projet
│   ├── 📄 README.md           # Vue d'ensemble de la documentation
│   └── 📄 DEVELOPMENT_GUIDE.md # Guide de développement
├── 📁 js/                     # Code source JavaScript
│   ├── 📄 app.js              # Point d'entrée principal - Bootstrap QuizApp
│   ├── 📁 modules/
│   │   ├── 📁 core/           # Logique métier centrale (singletons)
│   │   │   ├── 📄 config.js   # Configuration globale (AppConfig singleton)
│   │   │   ├── 📄 state.js    # Gestion d'état centralisée (QuizState)
│   │   │   ├── 📄 player.js   # Données joueur + localStorage
│   │   │   └── 📄 utils.js    # Utilitaires (confetti, shuffle, JSON)
│   │   ├── 📁 ui/             # Gestion de l'interface utilisateur
│   │   │   └── 📄 dom.js      # Manipulation DOM (DOMManager)
│   │   └── 📁 managers/       # Gestionnaires métier (pattern Manager)
│   │       ├── 📄 quiz-selector.js    # Sélection et filtrage des quiz
│   │       ├── 📄 question-manager.js # Affichage questions + timer
│   │       ├── 📄 results-manager.js  # Résultats et navigation
│   │       └── 📄 history-manager.js  # Historique joueur
│   └── 📁 data/               # Données des quiz (JSON)
│       ├── 📄 index.json      # Index auto-généré des quiz
│       ├── 📄 quiz-exemple.json
│       └── ...                # Autres fichiers de quiz
├── 📄 index.html              # Page HTML principale
├── 📄 api.py                  # Script Python - génération index.json
├── 📄 package.json            # Configuration npm
├── 📄 vercel.json             # Configuration déploiement Vercel
├── 📄 CLAUDE.md               # Instructions pour Claude Code
└── 📄 README.md               # Documentation principale
\```

## Légende des emojis

- 📁 Dossier
- 📄 Fichier
- ⚙️ Configuration
- 🎯 Point d'entrée
- 🔧 Utilitaire
- 🎨 Interface utilisateur
- 💾 Données
\```

# Exemples

<example>
**Entrée** : Commande `/architecture`

**Sortie attendue** : Fichier `.doc/architecture-2025-11-16-23-45-30.md` contenant l'arborescence complète avec commentaires précis sur chaque fichier.
</example>

<example>
**Commentaire pour un fichier** :
\```
📄 config.js    # Configuration globale (AppConfig singleton) - timeLimit, freeMode, categoryFilter
\```
</example>

<example>
**Dossier avec beaucoup de fichiers similaires** :
\```
📁 images/
├── 📄 logo.png        # Logo principal
├── 📄 hero-bg.jpg     # Image de fond
└── ...                # Autres images (10+ fichiers)
\```
Ou pour les quiz :
\```
📁 data/
├── 📄 index.json      # Index auto-généré
├── 📄 quiz-js-basics.json
├── 📄 quiz-react.json
└── ...                # Autres quiz (15+ fichiers)
\```
</example>

# Contraintes

- **Un seul fichier** : Génère uniquement le fichier d'arborescence, rien d'autre
- **Timestamp précis** : Utilise le format `YYYY-MM-DD-HH-MM-SS` pour le nom de fichier
- **Commentaires pertinents** : Chaque élément important doit avoir une description utile et concise
- **Vue d'ensemble lisible** : Priorise la clarté et la lisibilité, utilise "..." pour les fichiers nombreux et similaires
- **Pas de bavardage** : Le fichier ne contient que l'arborescence, pas d'introduction longue

# Notes importantes

- Ignore les dossiers `node_modules/`, `.git/`, `.vercel/` s'ils existent
- Les commentaires doivent expliquer le **rôle** du fichier, pas juste répéter son nom
- Utilise les emojis de manière cohérente (même emoji pour même type)
- Le format tree doit utiliser les caractères `├──`, `│`, et `└──` pour la structure
- **Pour les dossiers volumineux** : Liste 1-3 fichiers représentatifs puis utilise `└── ...` avec un commentaire indiquant le nombre approximatif de fichiers
