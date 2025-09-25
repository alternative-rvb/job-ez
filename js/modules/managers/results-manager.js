/**
 * Module de gestion des résultats de quiz
 */

import { quizState } from '../core/state.js';
import { domManager } from '../ui/dom.js';
import { launchConfetti } from '../core/utils.js';

export class ResultsManager {
    constructor(onRestart, onBackToHome) {
        this.onRestart = onRestart;
        this.onBackToHome = onBackToHome;
    }

    show() {
        const percentage = Math.round((quizState.score / quizState.questions.length) * 100);
        let message, emoji, bgColor;
        
        if (percentage >= 80) {
            message = "Excellent !";
            emoji = "🏆";
            bgColor = "from-green-400 to-emerald-500";
        } else if (percentage >= 60) {
            message = "Bien joué !";
            emoji = "👍";
            bgColor = "from-blue-400 to-cyan-500";
        } else if (percentage >= 40) {
            message = "Pas mal !";
            emoji = "👌";
            bgColor = "from-yellow-400 to-orange-500";
        } else {
            message = "Il faut réviser !";
            emoji = "📚";
            bgColor = "from-red-400 to-pink-500";
        }
        
        const resultsHTML = `
            <div class="text-center py-6 px-4 max-w-md mx-auto">
                <!-- Emoji avec animation bounce -->
                <div class="text-6xl sm:text-8xl mb-4 animate-bounce">${emoji}</div>
                
                <!-- Message principal -->
                <h2 class="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r ${bgColor} bg-clip-text text-transparent">
                    ${message}
                </h2>
                
                <!-- Score avec cercle de progression visuel -->
                <div class="mb-8">
                    <div class="relative w-32 h-32 mx-auto mb-4">
                        <svg class="transform -rotate-90 w-32 h-32">
                            <circle cx="64" cy="64" r="56" stroke="currentColor" stroke-width="8" 
                                    fill="none" class="text-gray-700"></circle>
                            <circle cx="64" cy="64" r="56" stroke="currentColor" stroke-width="8" 
                                    fill="none" class="text-primary-400 transition-all duration-1000" 
                                    stroke-dasharray="351.86" 
                                    stroke-dashoffset="${351.86 - (351.86 * percentage) / 100}"
                                    stroke-linecap="round"></circle>
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="text-center">
                                <div class="text-3xl font-bold text-white">${percentage}%</div>
                            </div>
                        </div>
                    </div>
                    <div class="text-xl sm:text-2xl font-bold text-primary-400 mb-2">
                        ${quizState.score}/${quizState.questions.length}
                    </div>
                    <div class="text-lg text-gray-300">questions correctes</div>
                </div>
                
                <!-- Boutons optimisés pour mobile -->
                <div class="space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                    <button id="restart-quiz" 
                            class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r ${quizState.currentQuiz.color} 
                                   text-white rounded-xl hover:scale-105 active:scale-95 
                                   transition-all duration-200 font-medium text-lg 
                                   touch-manipulation shadow-lg hover:shadow-xl
                                   flex items-center justify-center gap-2">
                        <i class="bi bi-arrow-clockwise"></i>
                        Recommencer
                    </button>
                    <button id="back-to-home" 
                            class="w-full sm:w-auto px-8 py-4 bg-gray-700 hover:bg-gray-600 
                                   text-white rounded-xl hover:scale-105 active:scale-95 
                                   transition-all duration-200 font-medium text-lg 
                                   touch-manipulation shadow-lg hover:shadow-xl
                                   flex items-center justify-center gap-2">
                        <i class="bi bi-house-door"></i>
                        Autre quiz
                    </button>
                </div>
            </div>
        `;
        
        domManager.setContent('quizContent', resultsHTML);
        
        // Animation de confettis pour les bons scores
        if (percentage >= 60) {
            launchConfetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        
        // Ajouter les écouteurs d'événements
        const restartBtn = document.getElementById('restart-quiz');
        const backBtn = document.getElementById('back-to-home');
        
        if (restartBtn) {
            restartBtn.addEventListener('click', this.onRestart);
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', this.onBackToHome);
        }
    }
}