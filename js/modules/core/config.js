/**
 * Configuration globale de l'application Quiz
 * Contient uniquement les paramètres vraiment globaux
 */

// Déterminer si on est sur la page privée ou publique
const isPrivate = window.location.pathname.includes('/private/');

export const CONFIG = {
    timeLimit: 10,        // Temps par question en secondes
    freeMode: false,      // Mode libre activé par défaut
    questionsPath: isPrivate ? '../js/data/' : 'js/data/',  // Chemin vers les fichiers de données
    categoryFilter: isPrivate ? null : ['Coaching']  // null = toutes les catégories, array = filtrer par ces catégories
};