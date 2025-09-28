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
        // En mode libre, rediriger vers la page de résultats avec un paramètre spécial
        if (CONFIG.freeMode) {
            // Sauvegarde des données minimales pour le mode libre
            const freeModeData = {
                freeMode: true,
                totalQuestions: quizState.questions.length,
                quizTitle: quizState.currentQuiz?.title || 'Quiz',
                quizId: quizState.currentQuiz?.id
            };
            
            localStorage.setItem('quizResults', JSON.stringify(freeModeData));
            
            // Redirection vers la page de résultats
            const quizId = quizState.currentQuiz?.id;
            window.location.href = `results.html${quizId ? `?quiz=${quizId}&mode=free` : '?mode=free'}`;
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
}