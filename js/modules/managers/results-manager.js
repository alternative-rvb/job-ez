/**
 * Module de gestion des résultats de quiz
 */

import { quizState } from '../core/state.js';
import { domManager } from '../ui/dom.js';
import { launchConfetti } from '../core/utils.js';
import { CONFIG } from '../core/config.js';

export class ResultsManager {
    constructor(onRestart, onBackToHome) {
        console.log('📦 ResultsManager constructor called');
        console.log('onRestart:', onRestart);
        console.log('onBackToHome:', onBackToHome);
        this.onRestart = onRestart;
        this.onBackToHome = onBackToHome;
    }

    show() {
        console.log('🎯 ResultsManager.show() called');
        console.log('Quiz state:', quizState);
        
        // Calculer le nombre de questions qui comptent pour le score
        const scorableQuestions = quizState.questions.filter(q => q.choices && q.choices.length > 0);
        const totalScorable = scorableQuestions.length;
        
        const score = quizState.score || 0;
        const percentage = totalScorable > 0 ? Math.round((score / totalScorable) * 100) : 0;
        
        console.log(`📊 Score: ${score}/${totalScorable} = ${percentage}%`);
        
        // Déterminer le message basé sur le pourcentage
        let message = '';
        let messageClass = '';
        if (percentage === 100) {
            message = '🎉 Parfait ! Vous maîtrisez ce quiz !';
            messageClass = 'text-green-400';
        } else if (percentage >= 80) {
            message = '😊 Très bien ! Continuez comme ça !';
            messageClass = 'text-green-400';
        } else if (percentage >= 60) {
            message = '👍 Bien ! Quelques lacunes à combler.';
            messageClass = 'text-yellow-400';
        } else if (percentage >= 40) {
            message = '📚 À améliorer. Révisez un peu !';
            messageClass = 'text-orange-400';
        } else {
            message = '💪 Pas grave ! Rejouez pour progresser !';
            messageClass = 'text-red-400';
        }
        
        // Construire le HTML des résultats
        const quizTitle = quizState.currentQuiz?.title || 'Quiz';
        
        const resultsHTML = `
            <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
                <div class="max-w-2xl mx-auto">
                    <!-- Header -->
                    <div class="text-center mb-8">
                        <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">Résultats</h1>
                        <p class="text-gray-400">${quizTitle}</p>
                    </div>

                    <!-- Score Card -->
                    <div class="bg-gray-800 rounded-2xl p-8 mb-8 text-center shadow-2xl">
                        <div class="mb-6">
                            <div class="text-7xl font-bold text-white">
                                ${percentage}%
                            </div>
                        </div>
                        
                        <div class="mb-6">
                            <p class="text-2xl font-bold text-white mb-2">${score} / ${totalScorable}</p>
                            <p class="text-gray-400">Bonnes réponses</p>
                        </div>
                        
                        <div class="p-4 bg-gray-700 rounded-xl mb-6">
                            <p class="text-lg ${messageClass} font-semibold">${message}</p>
                        </div>
                        
                        <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div class="bg-gradient-to-r from-primary-400 to-primary-600 h-full transition-all duration-500" 
                                 style="width: ${percentage}%"></div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <button id="btnRetry" class="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:opacity-90 transition-opacity font-bold text-lg">
                            <i class="bi bi-arrow-clockwise mr-2"></i> Rejouer
                        </button>
                        <button id="btnHome" class="w-full px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg hover:opacity-90 transition-opacity font-bold text-lg">
                            <i class="bi bi-house mr-2"></i> Retour à l'accueil
                        </button>
                    </div>

                    <!-- Details Section -->
                    <div class="bg-gray-800 rounded-2xl p-6 shadow-2xl">
                        <h2 class="text-xl font-bold text-white mb-6">Détails des réponses</h2>
                        <div class="space-y-4" id="detailsContainer">
                            ${this.renderDetails(quizState.questions)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        domManager.setContent('results-container', resultsHTML);
        console.log('✅ Results HTML set in DOM');
        
        // Masquer tous les autres conteneurs
        const quizSelection = document.getElementById('quiz-selection');
        const quizContainer = document.getElementById('quiz-container');
        const resultsContainer = document.getElementById('results-container');
        
        if (quizSelection) {
            quizSelection.classList.add('hidden');
            console.log('✅ Quiz selection hidden');
        }
        if (quizContainer) {
            quizContainer.classList.add('hidden');
            console.log('✅ Quiz container hidden');
        }
        if (resultsContainer) {
            resultsContainer.classList.remove('hidden');
            console.log('✅ Results container shown');
        }
        
        // Lancer confetti si 100%
        if (percentage === 100) {
            launchConfetti();
        }
        
        // Ajouter les écouteurs d'événements après un court délai pour assurer que le DOM est mis à jour
        const self = this; // Capturer 'this' pour éviter les problèmes de contexte
        setTimeout(() => {
            console.log('⏱️ Timeout callback - attaching event listeners');
            console.log('self:', self);
            console.log('self.onRestart:', self.onRestart);
            console.log('self.onBackToHome:', self.onBackToHome);
            
            const btnRetry = document.getElementById('btnRetry');
            const btnHome = document.getElementById('btnHome');
            
            console.log('btnRetry:', btnRetry);
            console.log('btnHome:', btnHome);
            
            if (btnRetry) {
                btnRetry.onclick = (e) => {
                    e.preventDefault();
                    console.log('🔄 Retry clicked');
                    console.log('self.onRestart:', self.onRestart);
                    if (self.onRestart) {
                        console.log('✅ Calling onRestart');
                        self.onRestart();
                    } else {
                        console.error('❌ onRestart not defined');
                    }
                };
            } else {
                console.error('❌ btnRetry element not found');
            }
            
            if (btnHome) {
                btnHome.onclick = (e) => {
                    e.preventDefault();
                    console.log('🏠 Home clicked');
                    console.log('self.onBackToHome:', self.onBackToHome);
                    if (self.onBackToHome) {
                        console.log('✅ Calling onBackToHome');
                        self.onBackToHome();
                    } else {
                        console.error('❌ onBackToHome not defined');
                    }
                };
            } else {
                console.error('❌ btnHome element not found');
            }
        }, 100);
    }
    
    renderDetails(questions) {
        return questions.map((q, index) => {
            const userAnswer = quizState.userAnswers[index];
            const isCorrect = quizState.userAnswersCorrect[index];
            const isFreeResponse = !q.choices || q.choices.length === 0;
            
            let userAnswerText = 'Non répondu';
            if (userAnswer !== undefined && !isFreeResponse) {
                userAnswerText = q.choices[userAnswer] || 'Réponse inconnue';
            } else if (isFreeResponse && userAnswer) {
                userAnswerText = userAnswer;
            }
            
            const statusIcon = isCorrect ? '✅' : '❌';
            const statusColor = isCorrect ? 'text-green-400' : 'text-red-400';
            
            return `
                <div class="border-l-4 ${isCorrect ? 'border-green-400' : 'border-red-400'} bg-gray-700 p-4 rounded">
                    <div class="flex items-start justify-between mb-2">
                        <h3 class="font-bold text-white flex-1">${index + 1}. ${q.question}</h3>
                        <span class="text-xl ml-2">${statusIcon}</span>
                    </div>
                    
                    <div class="space-y-1 text-sm">
                        <div>
                            <span class="text-gray-400">Votre réponse:</span>
                            <p class="${statusColor} font-semibold">${userAnswerText}</p>
                        </div>
                        ${!isCorrect ? `
                            <div>
                                <span class="text-gray-400">Bonne réponse:</span>
                                <p class="text-green-400 font-semibold">${q.correctAnswer}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
}