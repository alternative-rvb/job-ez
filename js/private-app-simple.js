/**
 * Application privée de quiz - Version simplifiée avec importation directe
 * @version 2.0.0
 * @author Alternative RVB
 */

// Importation directe des modules avec chemins relatifs corrects
const CONFIG = {
    timeLimit: 10, // secondes par défaut
    freeMode: false,
    questionsPath: '../js/data/'
};

// État global du quiz
const quizState = {
    currentQuiz: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    timer: null,
    startTime: null,
    
    reset() {
        this.currentQuiz = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.score = 0;
        this.timer = null;
        this.startTime = null;
    },
    
    setQuiz(quiz) {
        this.currentQuiz = quiz;
    },
    
    setQuestions(questions) {
        this.questions = questions;
    }
};

// Fonctions utilitaires
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

async function loadQuizData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur de chargement: ${response.status}`);
        }
        const quizData = await response.json();
        
        if (!quizData.questions || !Array.isArray(quizData.questions)) {
            throw new Error('Structure de données invalide: questions manquantes');
        }
        
        const processedQuestions = quizData.questions.map(question => {
            if (question.choices && question.choices.length > 0) {
                const choicesWithIndex = question.choices.map((choice, index) => ({
                    choice,
                    originalIndex: index,
                    isCorrect: choice === question.correctAnswer
                }));
                
                const shuffledChoices = shuffleArray(choicesWithIndex);
                
                return {
                    ...question,
                    choices: shuffledChoices.map(item => item.choice),
                    correctAnswer: question.correctAnswer
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

async function loadAvailableQuizzes() {
    let quizIds = [];

    try {
        const response = await fetch('../js/data/index.json');
        if (response.ok) {
            const indexData = await response.json();
            quizIds = indexData.quizzes || [];
            console.log(`📋 Quiz chargés depuis l'index (${quizIds.length} quiz disponibles)`);
        } else {
            throw new Error('Fichier d\'index non trouvé');
        }
    } catch (error) {
        console.warn('⚠️ Erreur lors du chargement de l\'index, utilisation de la liste de fallback:', error);
        quizIds = [
            'javascript-1',
            'spongebob',
            'animaux',
            'entretien-dev-web-1',
            'entretien-dev-web-2',
            'connecteurs-logiques-cm2'
        ];
    }

    const availableQuizzes = [];

    for (const quizId of quizIds) {
        try {
            const quizData = await loadQuizData(`../js/data/${quizId}.json`);
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

    console.log(`✅ ${availableQuizzes.length} quiz chargés avec succès`);
    return availableQuizzes;
}

// Gestionnaire des quiz
class PrivateQuizManager {
    constructor() {
        this.availableQuizzes = [];
        this.currentFilter = 'all';
    }

    async init() {
        console.log('Private Quiz App loaded');
        
        // Charger les quiz
        try {
            this.availableQuizzes = await loadAvailableQuizzes();
            await this.renderQuizzes();
            this.setupEventListeners();
            console.log('Private Quiz App initialisée avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
            this.showError('Erreur lors du chargement de l\'application');
        }
    }

    async renderQuizzes() {
        const quizListElement = document.getElementById('quiz-list');
        if (!quizListElement) {
            console.error('Élément quiz-list introuvable');
            return;
        }

        // Trier par catégorie
        const categoryOrder = { 'Développement': 1, 'Divertissement': 2, 'Apprentissage': 3, 'Coaching': 4 };
        const sortedQuizzes = this.availableQuizzes.sort((a, b) => {
            const orderA = categoryOrder[a.category] || 999;
            const orderB = categoryOrder[b.category] || 999;
            return orderA - orderB;
        });

        // Filtrer selon la catégorie sélectionnée
        const filteredQuizzes = this.currentFilter === 'all' 
            ? sortedQuizzes 
            : sortedQuizzes.filter(quiz => quiz.category === this.currentFilter);

        const quizCards = filteredQuizzes.map(quiz => {
            return `
                <div class="bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer quiz-card" 
                     data-quiz-id="${quiz.id}">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-3">
                            <div class="w-14 h-14 bg-gradient-to-r ${quiz.color} rounded-lg flex items-center justify-center">
                                <i class="bi ${quiz.icon} text-white text-xl"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white">${quiz.title}</h3>
                                <div class="flex gap-2 mt-1">
                                    <span class="text-sm px-3 bg-gray-600 rounded-full text-white font-medium">
                                        ${quiz.difficulty}
                                    </span>
                                    <span class="text-sm px-3 bg-blue-600 rounded-full text-white font-medium">
                                        ${quiz.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-primary-400">${quiz.questionCount}</div>
                            <div class="text-xs text-gray-400">questions</div>
                        </div>
                    </div>
                    <p class="text-gray-300 mb-4">${quiz.description}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center text-sm text-gray-400">
                            <i class="bi bi-clock mr-1"></i>
                            <span>~${Math.ceil(quiz.questionCount * CONFIG.timeLimit / 60)} min</span>
                        </div>
                        <button class="px-4 py-2 bg-gradient-to-r ${quiz.color} text-white rounded-lg hover:opacity-80 transition-opacity font-medium">
                            Commencer
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        quizListElement.innerHTML = quizCards;

        // Ajouter les événements de clic
        document.querySelectorAll('.quiz-card').forEach(card => {
            card.addEventListener('click', () => {
                const quizId = card.dataset.quizId;
                const selectedQuiz = this.availableQuizzes.find(q => q.id === quizId);
                if (selectedQuiz) {
                    this.startQuiz(selectedQuiz);
                }
            });
        });
    }

    setupEventListeners() {
        // Filtres de catégorie
        document.querySelectorAll('.category-filter').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.category-filter').forEach(btn => {
                    btn.classList.remove('selected', 'bg-primary-600');
                    btn.classList.add('bg-gray-700');
                });
                
                button.classList.add('selected', 'bg-primary-600');
                button.classList.remove('bg-gray-700');

                this.currentFilter = button.dataset.category;
                this.renderQuizzes();
            });
        });

        // Options de temps
        document.querySelectorAll('.time-option').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.time-option').forEach(btn => {
                    btn.classList.remove('selected');
                });
                button.classList.add('selected');
                CONFIG.timeLimit = parseInt(button.dataset.time);
                this.renderQuizzes(); // Re-render pour mettre à jour les temps
            });
        });

        // Modes de jeu
        document.querySelectorAll('.game-mode').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.game-mode').forEach(btn => {
                    btn.classList.remove('selected');
                });
                button.classList.add('selected');
                CONFIG.freeMode = button.id === 'free-mode';
                document.body.classList.toggle('free-mode', CONFIG.freeMode);
            });
        });
    }

    async startQuiz(selectedQuiz) {
        try {
            console.log('Démarrage du quiz:', selectedQuiz.title);
            // Pour l'instant, on affiche juste une alerte
            alert(`Quiz "${selectedQuiz.title}" sélectionné! (Fonctionnalité à implémenter)`);
        } catch (error) {
            console.error('Erreur lors du démarrage du quiz:', error);
            alert('Erreur lors du démarrage du quiz');
        }
    }

    showError(message) {
        const quizListElement = document.getElementById('quiz-list');
        if (quizListElement) {
            quizListElement.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center py-12">
                    <div class="text-red-400 text-6xl mb-4">
                        <i class="bi bi-exclamation-triangle"></i>
                    </div>
                    <p class="text-gray-300 text-lg text-center">${message}</p>
                    <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        Réessayer
                    </button>
                </div>
            `;
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const app = new PrivateQuizManager();
    app.init();
});