/**
 * Gestion de l'état global de l'application
 */

import { CONFIG } from './config.js';

class QuizState {
    constructor() {
        this.currentQuiz = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeRemaining = CONFIG.timeLimit;
        this.timerInterval = null;
        this.isAnswered = false;
        this.userAnswers = []; // Réponses de l'utilisateur
        this.questionStartTime = null; // Temps de début de la question
        this.totalTime = 0; // Temps total écoulé
    }

    reset() {
        this.currentQuiz = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeRemaining = CONFIG.timeLimit;
        this.isAnswered = false;
        this.userAnswers = [];
        this.questionStartTime = null;
        this.totalTime = 0;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    setQuiz(quiz) {
        this.currentQuiz = quiz;
    }

    setQuestions(questions) {
        this.questions = questions;
    }

    nextQuestion() {
        this.currentQuestionIndex++;
    }

    addScore() {
        this.score++;
    }

    startTimer() {
        this.timeRemaining = CONFIG.timeLimit;
        this.isAnswered = false;
    }

    setAnswered() {
        this.isAnswered = true;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    isQuizComplete() {
        return this.currentQuestionIndex >= this.questions.length;
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    // Gestion des réponses utilisateur
    recordAnswer(answerIndex) {
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
    }

    // Gestion du temps
    startQuestionTimer() {
        this.questionStartTime = Date.now();
    }

    endQuestionTimer() {
        if (this.questionStartTime) {
            const questionTime = (Date.now() - this.questionStartTime) / 1000; // en secondes
            this.totalTime += questionTime;
            this.questionStartTime = null;
        }
    }
}

export const quizState = new QuizState();