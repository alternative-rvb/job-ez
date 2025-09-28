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
        const questions = await response.json();
        
        // Mélanger les réponses pour chaque question à choix multiples
        return questions.map(question => {
            if (question.choices && question.choices.length > 0) {
                // Créer un tableau avec les réponses et leurs indices originaux
                const choicesWithIndex = question.choices.map((choice, index) => ({
                    choice,
                    originalIndex: index,
                    isCorrect: choice === question.correctAnswer
                }));
                
                // Mélanger les réponses
                const shuffledChoices = shuffleArray(choicesWithIndex);
                
                // Reconstruire la question avec les réponses mélangées
                return {
                    ...question,
                    choices: shuffledChoices.map(item => item.choice),
                    correctAnswer: question.correctAnswer // La bonne réponse reste la même
                };
            }
            return question; // Retourner la question inchangée si pas de choix multiples
        });
    } catch (error) {
        console.error('Erreur lors du chargement des questions:', error);
        throw error;
    }
}

/**
 * Charge les données d'un quiz (configuration + questions) depuis un fichier JSON
 * @param {string} url - URL du fichier JSON
 * @returns {Promise<Object>} - Promesse contenant {config, questions}
 */
export async function loadQuizData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur de chargement: ${response.status}`);
        }
        const quizData = await response.json();
        
        // Vérifier que la structure est correcte
        if (!quizData.questions || !Array.isArray(quizData.questions)) {
            throw new Error('Structure de données invalide: questions manquantes');
        }
        
        // Mélanger les réponses pour chaque question à choix multiples
        const processedQuestions = quizData.questions.map(question => {
            if (question.choices && question.choices.length > 0) {
                // Créer un tableau avec les réponses et leurs indices originaux
                const choicesWithIndex = question.choices.map((choice, index) => ({
                    choice,
                    originalIndex: index,
                    isCorrect: choice === question.correctAnswer
                }));
                
                // Mélanger les réponses
                const shuffledChoices = shuffleArray(choicesWithIndex);
                
                // Reconstruire la question avec les réponses mélangées
                return {
                    ...question,
                    choices: shuffledChoices.map(item => item.choice),
                    correctAnswer: question.correctAnswer // La bonne réponse reste la même
                };
            }
            return question;
        });
        
        return {
            config: quizData.config || {},
            questions: processedQuestions
        };
    } catch (error) {
        console.error('Erreur lors du chargement des données du quiz:', error);
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

/**
 * Charge la liste des quiz disponibles depuis les fichiers JSON
 * @returns {Promise<Array>} - Liste des quiz avec leurs configurations
 */
export async function loadAvailableQuizzes() {
    // Liste des IDs de quiz connus
    const quizIds = [
        'javascript-1',
        'spongebob',
        'animaux',
        'entretien-dev-web-1',
        'entretien-dev-web-2'
    ];

    const availableQuizzes = [];

    // Charger chaque quiz et extraire sa config
    for (const quizId of quizIds) {
        try {
            const quizData = await loadQuizData(`./js/data/${quizId}.json`);
            if (quizData && quizData.config) {
                availableQuizzes.push({
                    id: quizId,
                    ...quizData.config
                });
            }
        } catch (error) {
            console.warn(`Quiz ${quizId} non disponible:`, error);
        }
    }

    return availableQuizzes;
}