/**
 * Configuration globale de l'application Quiz
 * Contient uniquement les paramètres vraiment globaux
 */

// Déterminer si on est sur la page privée ou publique
const isPrivate = window.location.pathname.includes('/private');

class AppConfig {
    constructor() {
        this.timeLimit = 10;        // Temps par question en secondes
        this.freeMode = false;      // Mode libre activé par défaut
        this.questionsPath = '/js/data/';  // Chemin absolu depuis la racine
        this.showResponse = true;   // Afficher la bonne réponse en cas de mauvaise réponse
        this.categoryFilter = isPrivate ? null : ['Coaching'];  // null = toutes les catégories
        this.availableCategories = [];  // Mis à jour dynamiquement depuis l'index
        this.isPrivate = isPrivate;
    }

    // Méthode pour mettre à jour les catégories disponibles
    setAvailableCategories(categories) {
        this.availableCategories = categories || [];
        console.log('📦 Catégories disponibles mises à jour:', this.availableCategories);
    }

    // Méthode pour mettre à jour le filtre de catégories (utile pour la version privée)
    setCategoryFilter(categories) {
        this.categoryFilter = categories;
        console.log('🔍 Filtre de catégories mis à jour:', this.categoryFilter);
    }
}

export const CONFIG = new AppConfig();

console.log('🔍 CONFIG DEBUG:', {
    pathname: window.location.pathname,
    isPrivate: CONFIG.isPrivate,
    categoryFilter: CONFIG.categoryFilter,
    showResponse: CONFIG.showResponse
});