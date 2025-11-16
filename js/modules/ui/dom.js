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
            resultsContainer: document.getElementById('results-container'),
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
        const required = ['quizSelection', 'quizContainer', 'resultsContainer', 'quizList', 'quizContent'];
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
        this.elements.resultsContainer?.classList.add('hidden');
    }

    showQuizInterface() {
        this.elements.quizSelection?.classList.add('hidden');
        this.elements.quizContainer?.classList.remove('hidden');
        this.elements.resultsContainer?.classList.add('hidden');
    }

    showResults() {
        this.elements.quizSelection?.classList.add('hidden');
        this.elements.quizContainer?.classList.add('hidden');
        this.elements.resultsContainer?.classList.remove('hidden');
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
        
        // Mettre à jour la barre de progression
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const progressPercent = (currentIndex / totalQuestions) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
        
        if (this.elements.scoreDisplay) {
            this.elements.scoreDisplay.textContent = `Score: ${score}`;
        }
        if (this.elements.timerDisplay) {
            this.elements.timerDisplay.textContent = timeRemaining;
        }
    }

    setContent(elementName, html) {
        // Vérifier d'abord dans le mapping
        let element = this.elements[elementName];
        
        // Si pas trouvé, chercher directement par ID
        if (!element) {
            element = document.getElementById(elementName);
        }
        
        if (element) {
            element.innerHTML = html;
        } else {
            console.warn(`Element not found: ${elementName}`);
        }
    }
}

export const domManager = new DOMManager();