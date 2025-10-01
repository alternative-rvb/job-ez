# Quiz App - Structure Publique/Privée

## Version Publique (index.html)
- Affiche uniquement les quiz de catégorie "Développement"
- Interface simplifiée sans filtres de catégorie
- Lien vers la version privée

## Version Privée (private/index.html)
- Affiche TOUS les quiz (toutes catégories)
- Filtres de catégorie complets
- Interface d'administration

## Catégories disponibles :
- **Développement** : Quiz techniques (JavaScript, etc.)
- **Divertissement** : Quiz fun (Bob l'éponge, Animaux)
- **Apprentissage** : Quiz éducatifs (CM2, etc.)
- **Coaching** : Quiz d'entretien professionnel

## Fichiers modifiés :
- `index.html` : Version publique simplifiée
- `private/index.html` : Version privée complète
- `js/app.js` : Utilise PublicQuizSelector
- `js/private-app.js` : App privée avec tous les quiz
- `js/modules/managers/public-quiz-selector.js` : Sélecteur filtré
- `js/data/javascript-1.json` : Catégorie "Développement"