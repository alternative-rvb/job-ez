/**
 * Module de gestion des résultats de quiz
 */

import { quizState } from '../core/state.js';
import { domManager } from '../ui/dom.js';
import { launchConfetti } from '../core/utils.js';
import { CONFIG } from '../core/config.js';

export class ResultsManager {
    constructor(onRestart, onBackToHome) {
        this.onRestart = onRestart;
        this.onBackToHome = onBackToHome;
    }

    show() {
        // En mode spoiler, afficher un message simple au lieu des résultats
        if (CONFIG.spoilerMode) {
            this.showSpoilerEndMessage();
            return;
        }
        
        // Calculer le nombre de questions qui comptent pour le score (exclure les questions libres)
        const scorableQuestions = quizState.questions.filter(q => q.choices && q.choices.length > 0);
        const totalScorable = scorableQuestions.length;
        
        // Sauvegarde des données pour la page de résultats
        const resultsData = {
            score: quizState.score,
            totalQuestions: quizState.questions.length,
            totalScorable: totalScorable, // Nombre de questions qui comptent
            totalTime: quizState.totalTime || 0,
            quizTitle: quizState.currentQuiz?.title || 'Quiz',
            quizId: quizState.currentQuiz?.id,
            questions: quizState.questions.map((q, index) => {
                const userAnswer = quizState.userAnswers[index];
                let userAnswerText = undefined;
                let isFreeResponse = !q.choices || q.choices.length === 0;
                
                if (userAnswer !== undefined && !isFreeResponse) {
                    // Pour les choix multiples seulement
                    userAnswerText = q.choices[userAnswer] || 'Réponse inconnue';
                }
                
                return {
                    question: q.question,
                    choices: q.choices || q.options || [],
                    correctAnswer: q.correctAnswer || q.answer || 'Réponse inconnue',
                    userAnswer: userAnswerText,
                    isCorrect: quizState.userAnswersCorrect[index] || false,
                    isFreeResponse: isFreeResponse,
                    explanation: q.explanation || null
                };
            })
        };
        
        // Sauvegarde dans localStorage
        localStorage.setItem('quizResults', JSON.stringify(resultsData));

        // Redirection vers la page de résultats
        const quizId = quizState.currentQuiz?.id;
        window.location.href = `results.html${quizId ? `?quiz=${quizId}` : ''}`;
    }

    showSpoilerEndMessage() {
        // Afficher un message de fin pour le mode spoiler
        const endMessageHTML = `
            <div class="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
                <div class="text-center p-8 max-w-md mx-auto">
                    <div class="text-6xl mb-6">🎉</div>
                    <h2 class="text-3xl font-bold text-white mb-4">Merci !</h2>
                    <p class="text-lg text-gray-300 mb-8">
                        Vous avez terminé le quiz en mode spoiler.<br>
                        À bientôt pour de nouveaux défis !
                    </p>
                    <button onclick="window.location.href='index.html'" 
                            class="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                        <i class="bi bi-house mr-2"></i>
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        `;

        domManager.setContent('quizContent', endMessageHTML);
    }
}