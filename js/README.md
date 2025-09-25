# Structure des modules JavaScript

Cette application utilise une architecture modulaire ES6 organisée en dossiers thématiques.

## 📁 Structure des dossiers

```
js/
├── app.js                          # Point d'entrée principal
├── modules/
│   ├── core/                      # Modules fondamentaux
│   │   ├── config.js              # Configuration de l'application
│   │   ├── state.js               # Gestion de l'état global
│   │   └── utils.js               # Fonctions utilitaires
│   ├── ui/                        # Interface utilisateur
│   │   └── dom.js                 # Gestionnaire DOM
│   └── managers/                  # Gestionnaires de fonctionnalités
│       ├── quiz-selector.js       # Sélection des quiz
│       ├── question-manager.js    # Gestion des questions
│       └── results-manager.js     # Affichage des résultats
├── data/                          # Données des quiz (JSON)
└── archives/                      # Anciennes versions
```

## 🔗 Dépendances entre modules

### Core
- `config.js` : Configuration autonome
- `state.js` : Utilise `config.js`
- `utils.js` : Fonctions utilitaires autonomes

### UI
- `dom.js` : Gestionnaire DOM autonome

### Managers
- `quiz-selector.js` : Utilise `core/config.js` et `ui/dom.js`
- `question-manager.js` : Utilise `core/*` et `ui/dom.js`
- `results-manager.js` : Utilise `core/state.js`, `core/utils.js` et `ui/dom.js`

### App
- `app.js` : Orchestre tous les modules

## 🚀 Import/Export

Tous les modules utilisent la syntaxe ES6 :
```javascript
// Export
export const CONFIG = { ... };
export class QuizSelector { ... }

// Import
import { CONFIG } from './modules/core/config.js';
import { QuizSelector } from './modules/managers/quiz-selector.js';
```

## 📝 Avantages

- **Séparation claire** des responsabilités
- **Réutilisabilité** des modules
- **Maintenance** facilitée
- **Debugging** simplifié
- **Structure** scalable