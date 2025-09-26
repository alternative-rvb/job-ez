/**
 * Application principale de quiz
 * @version 2.0.0
 * @author Alternative RVB
 */

import { CONFIG } from './modules/core/config.js';
import { quizState } from './modules/core/state.js';
import { domManager } from './modules/ui/dom.js';
import { QuizSelector } from './modules/managers/quiz-selector.js';
import { QuestionManager } from './modules/managers/question-manager.js';
import { ResultsManager } from './modules/managers/results-manager.js';
import { shuffleArray, loadQuestions } from './modules/core/utils.js';

class QuizApp {
    constructor() {
        this.quizSelector = null;
        this.questionManager = null;
        this.resultsManager = null;
    }

    async init() {
        console.log('Quiz App loaded');
        
        // Initialiser le gestionnaire DOM
        if (!domManager.init()) {
            console.error('Impossible d\'initialiser l\'application');
            return;
        }

        // Initialiser les modules
        this.quizSelector = new QuizSelector((quiz) => this.startQuiz(quiz));
        this.questionManager = new QuestionManager(() => this.showResults());
        this.resultsManager = new ResultsManager(
            () => this.restartQuiz(),
            () => this.backToHome()
        );

        // Configurer les écouteurs d'événements globaux
        this.setupEventListeners();
        this.setupGameOptions();

        // Afficher la sélection des quiz
        this.quizSelector.show();

        console.log('Quiz App initialisée');
    }

    setupEventListeners() {
        // Bouton retour
        const backButton = domManager.get('backButton');
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
                const isSpoilerMode = button.id === 'spoiler-mode';
                CONFIG.spoilerMode = isSpoilerMode;

                // Ajouter/retirer la classe spoiler-mode sur le body
                document.body.classList.toggle('spoiler-mode', isSpoilerMode);
            });
        });
    }

    updateQuizCardsTime() {
        // Mettre à jour le temps estimé sur toutes les cartes de quiz
        document.querySelectorAll('.quiz-card').forEach(card => {
            const quizId = card.dataset.quizId;
            const quiz = CONFIG.availableQuizzes.find(q => q.id === quizId);
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

            // Charger les questions
            const questions = await loadQuestions(`${CONFIG.questionsPath}${selectedQuiz.id}.json`);
            
            // Configurer l'état du quiz
            quizState.reset();
            quizState.setQuiz(selectedQuiz);
            quizState.setQuestions(shuffleArray(questions));

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
        if (quizState.currentQuiz) {
            this.startQuiz(quizState.currentQuiz);
        }
    }

    backToHome() {
        quizState.reset();
        this.quizSelector.show();
    }
}

// Initialiser l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    const app = new QuizApp();
    app.init();
});