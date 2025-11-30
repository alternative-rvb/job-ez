/**
 * Module de gestion du système de récompense (trophées, points, codes secrets)
 */

export class RewardsManager {
    constructor() {
        this.storageKey = 'ez_job_rewards';
        this.initializeRewards();
    }

    /**
     * Initialise le système de récompenses en localStorage
     */
    initializeRewards() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialRewards = {
                totalPoints: 0,
                unlockedTrophies: [],
                secretCodes: {},
                pointsHistory: []
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialRewards));
        }
    }

    /**
     * Récupère les récompenses actuelles
     */
    getRewards() {
        const rewards = localStorage.getItem(this.storageKey);
        return rewards ? JSON.parse(rewards) : null;
    }

    /**
     * Sauvegarde les récompenses
     */
    saveRewards(rewards) {
        localStorage.setItem(this.storageKey, JSON.stringify(rewards));
    }

    /**
     * Calcule les points gagnés en fonction du score
     * @param {number} scorePercentage - Pourcentage de réussite (0-100)
     * @returns {number} Nombre de points gagnés
     */
    calculatePoints(scorePercentage) {
        if (scorePercentage === 100) {
            return 2;
        } else if (scorePercentage >= 80) {
            return 1;
        }
        return 0;
    }

    /**
     * Ajoute des points après un quiz
     * @param {number} scorePercentage - Pourcentage de réussite
     * @param {string} quizName - Nom du quiz
     * @returns {object} Objet avec pointsEarned et totalPoints
     */
    addPoints(scorePercentage, quizName) {
        const points = this.calculatePoints(scorePercentage);
        const rewards = this.getRewards();

        if (points > 0) {
            rewards.totalPoints += points;
            rewards.pointsHistory.push({
                points: points,
                quizName: quizName,
                scorePercentage: scorePercentage,
                date: new Date().toISOString()
            });
            this.saveRewards(rewards);
        }

        return {
            pointsEarned: points,
            totalPoints: rewards.totalPoints,
            canBuySecretCode: rewards.totalPoints >= 5
        };
    }

    /**
     * Génère un code secret aléatoire
     * @returns {string} Code secret généré
     */
    generateSecretCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    /**
     * Achète un code secret (coûte 5 points)
     * @param {string} trophyId - ID du trophée à débloquer
     * @returns {object|null} Code secret généré ou null si pas assez de points
     */
    buySecretCode(trophyId) {
        const rewards = this.getRewards();

        if (rewards.totalPoints < 5) {
            return null;
        }

        // Déduire les points
        rewards.totalPoints -= 5;

        // Générer le code secret
        const secretCode = this.generateSecretCode();

        // Stocker le code avec le trophée associé
        rewards.secretCodes[secretCode] = {
            trophy_id: trophyId,
            used: false,
            dateCreated: new Date().toISOString(),
            dateUsed: null
        };

        this.saveRewards(rewards);

        return {
            secretCode: secretCode,
            trophyId: trophyId,
            remainingPoints: rewards.totalPoints
        };
    }

    /**
     * Valide et utilise un code secret
     * @param {string} secretCode - Code à valider
     * @returns {object|null} Objet avec le trophée débloqué ou null si code invalide
     */
    useSecretCode(secretCode) {
        const rewards = this.getRewards();

        if (!rewards.secretCodes[secretCode]) {
            return null; // Code n'existe pas
        }

        const codeData = rewards.secretCodes[secretCode];

        if (codeData.used) {
            return null; // Code déjà utilisé
        }

        // Marquer comme utilisé
        codeData.used = true;
        codeData.dateUsed = new Date().toISOString();

        // Ajouter le trophée aux trophées débloqués
        if (!rewards.unlockedTrophies.includes(codeData.trophy_id)) {
            rewards.unlockedTrophies.push(codeData.trophy_id);
        }

        this.saveRewards(rewards);

        return {
            trophyId: codeData.trophy_id,
            successMessage: 'Trophée débloqué avec succès!'
        };
    }

    /**
     * Récupère les trophées débloqués
     * @returns {array} Liste des IDs des trophées débloqués
     */
    getUnlockedTrophies() {
        const rewards = this.getRewards();
        return rewards.unlockedTrophies || [];
    }

    /**
     * Récupère le total de points actuels
     * @returns {number} Total de points
     */
    getTotalPoints() {
        const rewards = this.getRewards();
        return rewards.totalPoints || 0;
    }

    /**
     * Vérifie si un code secret est valide et non utilisé
     * @param {string} secretCode - Code à vérifier
     * @returns {boolean}
     */
    isCodeValid(secretCode) {
        const rewards = this.getRewards();
        const codeData = rewards.secretCodes[secretCode];
        return codeData && !codeData.used;
    }

    /**
     * Récupère l'historique des points
     * @returns {array} Historique des points gagnés
     */
    getPointsHistory() {
        const rewards = this.getRewards();
        return rewards.pointsHistory || [];
    }

    /**
     * Réinitialise toutes les récompenses (pour les tests)
     */
    resetRewards() {
        localStorage.removeItem(this.storageKey);
        this.initializeRewards();
    }
}

// Export du singleton
export const rewardsManager = new RewardsManager();
