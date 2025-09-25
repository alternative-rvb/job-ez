# 🎯 Job Ready - Application de Quiz Interactifs

Une application web moderne de quiz interactifs développée avec JavaScript ES6 modules et Tailwind CSS. Parfaite pour tester vos connaissances dans différents domaines et vous préparer aux entretiens techniques.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![CSS](https://img.shields.io/badge/CSS-Tailwind-38B2AC.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

## ✨ Fonctionnalités

### 🎮 Interface de Quiz

- **Timer dynamique** avec animations et changements de couleur
- **Interface responsive** optimisée pour mobile et desktop
- **Feedback visuel** immédiat avec animations (bounce, shake, scale)
- **Vibration mobile** pour un retour haptique
- **Barre de progression** visuelle du quiz
- **Messages flottants** de feedback

### 🎨 Design Moderne

- **Dark theme** élégant avec Tailwind CSS
- **Animations CSS** personnalisées et fluides
- **Icons Bootstrap** pour une interface cohérente
- **Gradient backgrounds** et effets visuels
- **Touch-friendly** avec gestes optimisés

### 📊 Système de Résultats

- **Cercle de progression SVG** animé
- **Messages personnalisés** selon le score
- **Effets confettis** pour les bons scores
- **Statistiques détaillées** de performance

### 🔧 Architecture Technique

- **Modules ES6** avec import/export natifs
- **Architecture MVC** avec séparation des responsabilités
- **State management** centralisé
- **Configuration modulaire** et extensible

## 🚀 Démarrage Rapide

### Prérequis

- Navigateur web moderne supportant les modules ES6
- Serveur HTTP local pour éviter les erreurs CORS

### Installation

1. **Cloner le repository**

```bash
git clone https://github.com/alternative-rvb/job-ready.git
cd job-ready
```

2. **Lancer un serveur local**

```bash
# Python 3
python3 -m http.server 8000

# Node.js (si disponible)
npx serve .

# PHP (si disponible)
php -S localhost:8000
```

3. **Accéder à l'application**
Ouvrez votre navigateur sur `http://localhost:8000`

## 📱 Utilisation

### Sélection d'un Quiz

1. Sur la page d'accueil, choisissez parmi les quiz disponibles
2. Chaque quiz affiche son thème, description et nombre de questions
3. Cliquez sur "Commencer" pour démarrer

### Pendant le Quiz

- **Timer** : Compteur visible en haut avec animations
- **Questions** : Une question à la fois avec options multiples
- **Navigation** : Sélection directe des réponses
- **Feedback** : Retour visuel immédiat sur chaque réponse

### Résultats

- **Score final** avec pourcentage et statistiques
- **Messages personnalisés** selon la performance
- **Options** : Recommencer le même quiz ou choisir un autre

## 🗂️ Structure du Projet

```
job-ready/
├── 📄 index.html              # Page principale avec Tailwind CSS
├── 📁 images/                 # Assets visuels
│   ├── 1-Bob-leponge.jpg
│   ├── spongebob.jpg
│   ├── start.gif
│   └── win.gif
├── 📁 js/                     # Code JavaScript modulaire
│   ├── 📄 app.js             # Point d'entrée principal
│   ├── 📁 modules/           # Architecture modulaire
│   │   ├── 📁 core/          # Logique fondamentale
│   │   │   ├── config.js     # Configuration globale
│   │   │   ├── state.js      # Gestion d'état
│   │   │   └── utils.js      # Utilitaires partagés
│   │   ├── 📁 ui/            # Interface utilisateur
│   │   │   └── dom.js        # Manipulation DOM
│   │   └── 📁 managers/      # Gestionnaires métier
│   │       ├── quiz-selector.js    # Sélection des quiz
│   │       ├── question-manager.js # Gestion des questions
│   │       └── results-manager.js  # Affichage résultats
│   ├── 📁 data/              # Données des quiz (JSON)
│   │   ├── javascript-1.json      # Questions JavaScript
│   │   ├── spongebob.json         # Quiz SpongeBob
│   │   ├── animaux.json           # Quiz Animaux
│   │   └── entretien-dev-web-1.json # Entretien développeur
│   └── 📁 archives/          # Versions antérieures
└── 📄 README.md              # Documentation
```

## 🔧 Architecture Technique

### Modules Core

- **`config.js`** : Configuration globale (timer, chemins, quiz disponibles)
- **`state.js`** : Gestion centralisée de l'état de l'application
- **`utils.js`** : Fonctions utilitaires (chargement JSON, confettis)

### Modules UI

- **`dom.js`** : Classe DOMManager pour la manipulation des éléments

### Modules Managers

- **`quiz-selector.js`** : Gestion de la sélection des quiz
- **`question-manager.js`** : Logique des questions et timer
- **`results-manager.js`** : Affichage des résultats et navigation

### Flux de Données

```
app.js → QuizApp → Managers → State → DOM
   ↓        ↓         ↓        ↓      ↓
Config → Utils → Core Logic → UI → User
```

## 🎨 Personnalisation

### Ajouter un Nouveau Quiz

1. **Créer le fichier JSON** dans `js/data/`

```json
{
  "title": "Mon Quiz",
  "questions": [
    {
      "question": "Ma question ?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Explication de la réponse"
    }
  ]
}
```

2. **Mettre à jour la configuration** dans `js/modules/core/config.js`

```javascript
availableQuizzes: [
  // ... autres quiz
  {
    id: 'mon-quiz',
    title: 'Mon Quiz',
    description: 'Description du quiz',
    icon: 'bi-star',
    color: 'from-purple-400 to-pink-500',
    file: 'mon-quiz.json'
  }
]
```

### Modifier le Design

- **Couleurs** : Adapter les gradients dans `config.js`
- **Animations** : Personnaliser les keyframes CSS dans `index.html`
- **Layout** : Modifier les classes Tailwind dans les managers

### Configuration du Timer

```javascript
// Dans config.js
export const CONFIG = {
    timeLimit: 15, // Durée en secondes
    // ...
}
```

## 🌐 Technologies Utilisées

### Frontend

- **HTML5** avec structure sémantique
- **Tailwind CSS v3** via CDN (dark theme)
- **JavaScript ES6+** avec modules natifs
- **Bootstrap Icons** pour l'iconographie

### Bibliothèques

- **tsparticles-confetti** pour les effets de confettis
- **Vibration API** pour le feedback haptique mobile

### Outils de Développement

- **Git** pour le versioning
- **HTTP Server** pour le développement local
- **ES6 Modules** pour l'organisation du code

## 📊 Données et Format

### Structure d'un Quiz JSON

```json
{
  "title": "Titre du Quiz",
  "questions": [
    {
      "question": "Texte de la question",
      "options": ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
      "correct": 2,
      "explanation": "Explication détaillée de la bonne réponse"
    }
  ]
}
```

### Quiz Disponibles

- **JavaScript Fondamentaux** : Concepts de base et syntaxe
- **SpongeBob** : Quiz ludique sur l'univers de la série
- **Animaux** : Connaissances générales sur la faune
- **Entretien Développeur Web** : Questions techniques d'entretien

## 🎯 Fonctionnalités Avancées

### Mobile-First

- Interface tactile optimisée
- Gestures et animations fluides
- Vibrations pour le feedback
- Design responsive sur tous écrans

### Performance

- Chargement lazy des données JSON
- Animations GPU-accelerated
- Code modulaire pour un loading optimal
- Cache des éléments DOM fréquemment utilisés

### Accessibilité

- Contraste optimisé (dark theme)
- Icons avec labels sémantiques
- Navigation au clavier
- Structure HTML5 sémantique

## 🔄 Roadmap

### Version 2.1 (À venir)

- [ ] Mode multijoueur local
- [ ] Sauvegarde des scores
- [ ] Quiz chronométrés avancés
- [ ] Export des résultats

### Version 2.2

- [ ] Création de quiz via interface
- [ ] Thèmes personnalisables
- [ ] Mode hors-ligne (PWA)
- [ ] Analytics de performance

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Pushez sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

### Guidelines de Développement

- Utilisez les modules ES6
- Suivez les conventions de nommage existantes
- Documentez les nouvelles fonctionnalités
- Testez sur mobile et desktop
- Respectez l'architecture modulaire

## 📄 License

Ce projet est sous licence ISC. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **Alternative RVB** - Développement initial - [@alternative-rvb](https://github.com/alternative-rvb)

## 🙏 Remerciements

- **Tailwind CSS** pour le framework CSS moderne
- **Bootstrap Icons** pour l'iconographie
- **tsparticles** pour les effets visuels
- La communauté JavaScript pour l'inspiration

---

⭐ **N'hésitez pas à mettre une étoile si ce projet vous a aidé !**
