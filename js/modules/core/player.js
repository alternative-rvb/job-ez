/**
 * Gestion du joueur et de ses résultats
 */

class PlayerManager {
    constructor() {
        this.playerName = this.loadPlayerName();
        this.results = this.loadResults();
    }

    // Charger le nom du joueur depuis le localStorage
    loadPlayerName() {
        return localStorage.getItem('playerName') || null;
    }

    // Sauvegarder le nom du joueur
    setPlayerName(name) {
        const cleanName = name.trim();
        if (cleanName.length === 0) {
            console.warn('Le nom du joueur ne peut pas être vide');
            return false;
        }
        this.playerName = cleanName;
        localStorage.setItem('playerName', cleanName);
        console.log(`👤 Joueur: ${cleanName}`);
        return true;
    }

    // Charger tous les résultats depuis le localStorage
    loadResults() {
        const stored = localStorage.getItem('playerResults');
        return stored ? JSON.parse(stored) : [];
    }

    // Sauvegarder un nouveau résultat
    saveResult(quizData) {
        const result = {
            id: Date.now(),
            quizId: quizData.id,
            quizTitle: quizData.title,
            score: quizData.score,
            totalQuestions: quizData.totalQuestions,
            percentage: quizData.percentage,
            timeSpent: quizData.timeSpent,
            date: new Date().toISOString(),
            difficulty: quizData.difficulty,
            category: quizData.category,
            pointsEarned: quizData.pointsEarned || 0,
            totalPoints: quizData.totalPoints || 0
        };

        this.results.push(result);
        localStorage.setItem('playerResults', JSON.stringify(this.results));
        console.log(`📊 Résultat sauvegardé:`, result);
        return result;
    }

    // Obtenir tous les résultats
    getAllResults() {
        return this.results;
    }

    // Obtenir les résultats d'un quiz spécifique
    getResultsByQuiz(quizId) {
        return this.results.filter(r => r.quizId === quizId);
    }

    // Obtenir les statistiques globales
    getStats() {
        if (this.results.length === 0) {
            return {
                totalQuizzes: 0,
                averageScore: 0,
                bestScore: 0,
                worstScore: 0,
                totalTimeSpent: 0
            };
        }

        const scores = this.results.map(r => r.percentage);
        const totalTime = this.results.reduce((sum, r) => sum + (r.timeSpent || 0), 0);

        return {
            totalQuizzes: this.results.length,
            averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            bestScore: Math.max(...scores),
            worstScore: Math.min(...scores),
            totalTimeSpent: totalTime
        };
    }

    // Réinitialiser les données du joueur
    reset() {
        localStorage.removeItem('playerName');
        localStorage.removeItem('playerResults');
        this.playerName = null;
        this.results = [];
        console.log('🗑️  Données du joueur réinitialisées');
    }

    // Formater une date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

export const playerManager = new PlayerManager();
