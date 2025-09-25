/**
 * Gestion des éléments DOM
 */

class DOMManager {
    constructor() {
        this.elements = {};
    }

    init() {
        this.elements = {
            quizSelection: document.getElementById('quiz-selection'),
            quizContainer: document.getElementById('quiz-container'),
            quizList: document.getElementById('quiz-list'),
            quizContent: document.getElementById('quiz-content'),
            quizTitle: document.getElementById('quiz-title'),
            questionCounter: document.getElementById('question-counter'),
            scoreDisplay: document.getElementById('score-display'),
            timerDisplay: document.getElementById('timer-display'),
            backButton: document.getElementById('back-to-selection'),
            mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
            mobileMenu: document.getElementById('mobile-menu')
        };

        // Vérifier que les éléments essentiels existent
        const required = ['quizSelection', 'quizContainer', 'quizList', 'quizContent'];
        const missing = required.filter(key => !this.elements[key]);
        
        if (missing.length > 0) {
            console.error('Éléments DOM manquants:', missing);
            return false;
        }

        return true;
    }

    get(elementName) {
        return this.elements[elementName];
    }

    showQuizSelection() {
        this.elements.quizSelection?.classList.remove('hidden');
        this.elements.quizContainer?.classList.add('hidden');
    }

    showQuizInterface() {
        this.elements.quizSelection?.classList.add('hidden');
        this.elements.quizContainer?.classList.remove('hidden');
    }

    toggleMobileMenu() {
        this.elements.mobileMenu?.classList.toggle('hidden');
    }

    updateQuizTitle(title) {
        if (this.elements.quizTitle) {
            this.elements.quizTitle.textContent = title;
        }
    }

    updateQuizStats(currentIndex, totalQuestions, score, timeRemaining) {
        if (this.elements.questionCounter) {
            this.elements.questionCounter.textContent = `Question ${currentIndex + 1}/${totalQuestions}`;
        }
        if (this.elements.scoreDisplay) {
            this.elements.scoreDisplay.textContent = `Score: ${score}`;
        }
        if (this.elements.timerDisplay) {
            this.elements.timerDisplay.textContent = timeRemaining;
        }
    }

    setContent(elementName, html) {
        const element = this.elements[elementName];
        if (element) {
            element.innerHTML = html;
        }
    }
}

export const domManager = new DOMManager();