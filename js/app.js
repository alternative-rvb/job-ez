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

        // Menu mobile
        const mobileMenuToggle = domManager.get('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                domManager.toggleMobileMenu();
            });
        }
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