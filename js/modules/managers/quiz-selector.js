/**
 * Module de sélection des quiz
 */

import { CONFIG } from '../core/config.js';
import { loadAvailableQuizzes } from '../core/utils.js';
import { domManager } from '../ui/dom.js';

export class QuizSelector {
    constructor(onQuizSelect) {
        this.onQuizSelect = onQuizSelect;
    }

    async render() {
        // Afficher le loader
        this.showLoader();
        
        const startTime = Date.now();
        
        try {
            const availableQuizzes = await loadAvailableQuizzes();
            
            // Trier par catégorie dans l'ordre souhaité
            const categoryOrder = { 'Divertissement': 1, 'Apprentissage': 2, 'Coaching': 3 };
            const sortedQuizzes = availableQuizzes.sort((a, b) => {
                const orderA = categoryOrder[a.category] || 999;
                const orderB = categoryOrder[b.category] || 999;
                return orderA - orderB;
            });
            
            this.allQuizzes = sortedQuizzes;
            this.currentFilter = 'all';
            
            // Assurer un délai minimum de 500ms pour le loader
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, 500 - elapsedTime);
            
            setTimeout(() => {
                this.renderQuizCards();
                this.hideLoader();
            }, remainingTime);
            
        } catch (error) {
            console.error('Erreur lors du chargement des quiz:', error);
            this.showError('Erreur lors du chargement des quiz. Veuillez réessayer.');
        }
    }

    renderQuizCards() {
        // Remettre les classes originales de la grille
        const quizListContainer = document.getElementById('quiz-list');
        quizListContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6';
        
        const filteredQuizzes = this.currentFilter === 'all' 
            ? this.allQuizzes 
            : this.allQuizzes.filter(quiz => quiz.category === this.currentFilter);
            
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
                                    <span class="text-sm px-3 bg-gray-600 rounded-full text-gray-300 font-medium">
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
        
        domManager.setContent('quizList', quizCards);
        
        // Ajouter les écouteurs d'événements
        document.querySelectorAll('.quiz-card').forEach(card => {
            card.addEventListener('click', () => {
                const quizId = card.dataset.quizId;
                const selectedQuiz = this.allQuizzes.find(q => q.id === quizId);
                if (selectedQuiz && this.onQuizSelect) {
                    this.onQuizSelect(selectedQuiz);
                }
            });
        });
    }

    setupFilters() {
        document.querySelectorAll('.category-filter').forEach(button => {
            button.addEventListener('click', () => {
                // Retirer la classe selected de tous les boutons
                document.querySelectorAll('.category-filter').forEach(btn => {
                    btn.classList.remove('selected');
                    btn.classList.remove('bg-primary-600');
                    btn.classList.add('bg-gray-700');
                });
                // Ajouter la classe selected au bouton cliqué
                button.classList.add('selected');
                button.classList.remove('bg-gray-700');
                button.classList.add('bg-primary-600');

                // Mettre à jour le filtre
                this.currentFilter = button.dataset.category;
                this.renderQuizCards();
            });
        });
    }

    async show() {
        domManager.showQuizSelection();
        await this.render();
        this.setupFilters();
    }

    showLoader() {
        // Changer les classes du conteneur pour permettre le centrage
        const quizListContainer = document.getElementById('quiz-list');
        quizListContainer.className = 'flex items-center justify-center min-h-[300px]';
        
        const loaderHTML = `
            <div class="flex flex-col items-center justify-center py-8">
                <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-400 mb-6"></div>
                <p class="text-gray-400 text-xl font-medium">Chargement des quiz...</p>
                <p class="text-gray-500 text-sm mt-2">Veuillez patienter</p>
            </div>
        `;
        domManager.setContent('quizList', loaderHTML);
    }

    hideLoader() {
        // Le loader sera remplacé par les cartes de quiz dans renderQuizCards()
    }

    showError(message) {
        // Changer les classes du conteneur pour permettre le centrage
        const quizListContainer = document.getElementById('quiz-list');
        quizListContainer.className = 'flex items-center justify-center min-h-[300px]';
        
        const errorHTML = `
            <div class="flex flex-col items-center justify-center py-8">
                <div class="text-red-400 text-6xl mb-6">
                    <i class="bi bi-exclamation-triangle"></i>
                </div>
                <p class="text-gray-300 text-xl text-center font-medium mb-4">${message}</p>
                <button onclick="location.reload()" class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                    Réessayer
                </button>
            </div>
        `;
        domManager.setContent('quizList', errorHTML);
    }
}