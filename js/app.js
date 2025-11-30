/**
 * Application principale de quiz
 * @version 2.0.0
 * @author Alternative RVB
 */

import { CONFIG } from './modules/core/config.js';
import { quizState } from './modules/core/state.js';
import { domManager } from './modules/ui/dom.js';
import { playerManager } from './modules/core/player.js';
import { QuizSelector } from './modules/managers/quiz-selector.js';
import { QuestionManager } from './modules/managers/question-manager.js';
import { ResultsManager } from './modules/managers/results-manager.js';
import { HistoryManager } from './modules/managers/history-manager.js';
import { TrophiesManager } from './modules/managers/trophies-manager.js';
import { shuffleArray, loadQuizData } from './modules/core/utils.js';
import { initializeCategoryColors } from './modules/core/category-colors.js';

class QuizApp {
    constructor() {
        this.quizSelector = null;
        this.questionManager = null;
        this.resultsManager = null;
        this.historyManager = null;
        this.trophiesManager = null;
        this.availableQuizzes = [];
    }

    async init() {
        console.log('Quiz App loaded');
        
        // Initialiser les couleurs des catégories
        await initializeCategoryColors();
        
        // Initialiser le gestionnaire DOM
        if (!domManager.init()) {
            console.error('Impossible d\'initialiser l\'application');
            return;
        }

        // Vérifier si le joueur a déjà un nom
        if (playerManager.playerName) {
            console.log(`👤 Bienvenue ${playerManager.playerName}`);
            this.showQuizSelection();
        } else {
            this.showPlayerNameScreen();
        }

        console.log('Quiz App initialisée');
    }

    showPlayerNameScreen() {
        const screen = document.getElementById('player-name-screen');
        const form = document.getElementById('player-name-form');
        const input = document.getElementById('player-name-input');

        if (screen) {
            screen.classList.remove('hidden');
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = input.value.trim();
                if (name.length > 0) {
                    playerManager.setPlayerName(name);
                    this.showQuizSelection();
                } else {
                    input.focus();
                }
            });
            input.focus();
        }
    }

    async showQuizSelection() {
        // Masquer l'écran de saisie du nom
        const nameScreen = document.getElementById('player-name-screen');
        if (nameScreen) {
            nameScreen.classList.add('hidden');
        }

        // Afficher le nom du joueur
        const playerDisplay = document.getElementById('player-name-display');
        if (playerDisplay) {
            playerDisplay.textContent = playerManager.playerName;
        }

        // Initialiser les modules
        this.quizSelector = new QuizSelector((quiz) => this.startQuiz(quiz));
        this.questionManager = new QuestionManager(() => this.showResults());
        this.resultsManager = new ResultsManager(
            () => this.restartQuiz(),
            () => this.backToHome(),
            () => this.trophiesManager.show()
        );
        this.historyManager = new HistoryManager(() => this.backToHome());
        this.trophiesManager = new TrophiesManager(() => this.backToHome());

        // Configurer les écouteurs d'événements globaux
        this.setupEventListeners();
        this.setupGameOptions();

        // Charger la liste des quiz disponibles
        const { loadAvailableQuizzes } = await import('./modules/core/utils.js');
        this.availableQuizzes = await loadAvailableQuizzes();

        // Afficher la sélection des quiz
        await this.quizSelector.show();

        // Ajouter les écouteurs pour l'historique et le changement de joueur
        this.setupHistoryButtons();
    }

    setupHistoryButtons() {
        // Bouton historique
        const btnHistory = document.getElementById('btn-show-history');
        if (btnHistory) {
            btnHistory.addEventListener('click', () => {
                this.historyManager.show();
            });
        }

        // Bouton trophées
        const btnTrophies = document.getElementById('btn-show-trophies');
        if (btnTrophies) {
            btnTrophies.addEventListener('click', () => {
                this.trophiesManager.show();
            });
        }

        // Bouton changer de joueur
        const btnChangePlayer = document.getElementById('btn-change-player');
        if (btnChangePlayer) {
            btnChangePlayer.addEventListener('click', () => {
                playerManager.reset();
                location.reload();
            });
        }
    }

    setupEventListeners() {
        // Bouton retour à la sélection
        const backButton = document.getElementById('back-to-selection');
        if (backButton) {
            backButton.addEventListener('click', () => this.backToHome());
        }
    }

    setupGameOptions() {
        // Gestionnaire pour les boutons de temps
        document.querySelectorAll('.time-option').forEach(button => {
            button.addEventListener('click', () => {
                // Retirer la classe selected de tous les boutons
                document.querySelectorAll('.time-option').forEach(btn => {
                    btn.classList.remove('selected');
                });
                // Ajouter la classe selected au bouton cliqué
                button.classList.add('selected');

                // Mettre à jour la configuration
                const timeLimit = parseInt(button.dataset.time);
                CONFIG.timeLimit = timeLimit;

                // Mettre à jour l'affichage du temps estimé sur les cartes
                this.updateQuizCardsTime();
            });
        });

        // Gestionnaire pour les modes de jeu
        document.querySelectorAll('.game-mode').forEach(button => {
            button.addEventListener('click', () => {
                // Retirer la classe selected de tous les boutons
                document.querySelectorAll('.game-mode').forEach(btn => {
                    btn.classList.remove('selected');
                });
                // Ajouter la classe selected au bouton cliqué
                button.classList.add('selected');

                // Mettre à jour la configuration
                const isFreeMode = button.id === 'free-mode';
                CONFIG.freeMode = isFreeMode;

                // Ajouter/retirer la classe free-mode sur le body
                document.body.classList.toggle('free-mode', isFreeMode);
            });
        });
    }

    updateQuizCardsTime() {
        // Mettre à jour le temps estimé sur toutes les cartes de quiz
        document.querySelectorAll('.quiz-card').forEach(card => {
            const quizId = card.dataset.quizId;
            const quiz = this.availableQuizzes.find(q => q.id === quizId);
            if (quiz) {
                const timeElement = card.querySelector('.text-sm.text-gray-400 span');
                if (timeElement) {
                    const estimatedTime = Math.ceil(quiz.questionCount * CONFIG.timeLimit / 60);
                    timeElement.textContent = `~${estimatedTime} min`;
                }
            }
        });
    }

    async startQuiz(selectedQuiz) {
        try {
            // Afficher le message de chargement
            domManager.showQuizInterface();
            domManager.updateQuizTitle(selectedQuiz.title);
            this.questionManager.showLoadingMessage();

            // Charger les données du quiz (config + questions)
            const quizData = await loadQuizData(`${CONFIG.questionsPath}${selectedQuiz.id}.json`);
            
            // Fusionner la configuration du fichier JSON avec celle de config.js
            const mergedQuiz = {
                ...selectedQuiz,
                ...quizData.config
            };
            
            // Configurer l'état du quiz
            quizState.reset();
            quizState.setQuiz(mergedQuiz);
            quizState.setQuestions(shuffleArray(quizData.questions));

            // Démarrer la première question
            this.questionManager.showQuestion();

        } catch (error) {
            console.error('Erreur lors du démarrage du quiz:', error);
            alert('Erreur lors du chargement du quiz. Veuillez réessayer.');
        }
    }

    showResults() {
        this.resultsManager.show();
    }

    restartQuiz() {
        console.log('🔄 App.restartQuiz() called');
        if (quizState.currentQuiz) {
            this.startQuiz(quizState.currentQuiz);
        }
    }

    async backToHome() {
        console.log('🏠 App.backToHome() called');
        quizState.reset();
        
        // Afficher la sélection des quiz
        const quizSelection = document.getElementById('quiz-selection');
        const historyScreen = document.getElementById('history-screen');
        if (quizSelection) {
            quizSelection.classList.remove('hidden');
        }
        if (historyScreen) {
            historyScreen.classList.add('hidden');
        }
        
        domManager.showQuizSelection();
    }
}

// Initialiser l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    const app = new QuizApp();
    app.init();
});