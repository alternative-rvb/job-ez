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
        const availableQuizzes = await loadAvailableQuizzes();
        const quizCards = availableQuizzes.map(quiz => {
            return `
                <div class="bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer quiz-card" 
                     data-quiz-id="${quiz.id}">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-gradient-to-r ${quiz.color} rounded-lg flex items-center justify-center">
                                <i class="bi ${quiz.icon} text-white text-xl"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white">${quiz.title}</h3>
                                <span class="text-sm px-2 py-1 bg-gradient-to-r ${quiz.color} rounded-full text-white font-medium">
                                    ${quiz.difficulty}
                                </span>
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
                const selectedQuiz = availableQuizzes.find(q => q.id === quizId);
                if (selectedQuiz && this.onQuizSelect) {
                    this.onQuizSelect(selectedQuiz);
                }
            });
        });
    }

    async show() {
        domManager.showQuizSelection();
        await this.render();
    }
}