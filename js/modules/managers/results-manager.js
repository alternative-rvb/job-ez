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
        // Sauvegarde des données pour la page de résultats
        const resultsData = {
            score: quizState.score,
            totalQuestions: quizState.questions.length,
            totalTime: quizState.totalTime || 0,
            quizTitle: quizState.currentQuiz?.title || 'Quiz',
            quizId: quizState.currentQuiz?.id,
            questions: quizState.questions.map((q, index) => ({
                question: q.question,
                options: q.options,
                correct: q.answer,
                userAnswer: quizState.userAnswers[index],
                explanation: q.explanation || null
            }))
        };

        // Sauvegarde dans localStorage
        localStorage.setItem('quizResults', JSON.stringify(resultsData));

        // Redirection vers la page de résultats
        const quizId = quizState.currentQuiz?.id;
        window.location.href = `results.html${quizId ? `?quiz=${quizId}` : ''}`;
    }
}