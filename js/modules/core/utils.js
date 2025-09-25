/**
 * Fonctions utilitaires
 */

/**
 * Mélange un tableau (algorithme Fisher-Yates)
 * @param {Array} array - Tableau à mélanger
 * @returns {Array} - Tableau mélangé
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Charge les questions depuis un fichier JSON
 * @param {string} url - URL du fichier JSON
 * @returns {Promise<Array>} - Promesse contenant les questions
 */
export async function loadQuestions(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur de chargement: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors du chargement des questions:', error);
        throw error;
    }
}

/**
 * Lance les confettis
 * @param {Object} options - Options pour les confettis
 */
export function launchConfetti(options = {}) {
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            ...options
        });
    }
}