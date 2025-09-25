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
    }

    reset() {
        this.currentQuiz = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeRemaining = CONFIG.timeLimit;
        this.isAnswered = false;
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
}

export const quizState = new QuizState();