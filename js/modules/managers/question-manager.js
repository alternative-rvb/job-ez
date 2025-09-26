/**
 * Module de gestion des questions de quiz
 */

import { CONFIG } from '../core/config.js';
import { quizState } from '../core/state.js';
import { domManager } from '../ui/dom.js';
import { launchConfetti } from '../core/utils.js';

export class QuestionManager {
    constructor(onQuizComplete) {
        this.onQuizComplete = onQuizComplete;
    }

    showQuestion() {
        if (quizState.isQuizComplete()) {
            this.onQuizComplete();
            return;
        }
        
        const question = quizState.getCurrentQuestion();
        
        quizState.startTimer();
        quizState.startQuestionTimer();
        
        let imageSection = '';
        if (question.imageUrl) {
            const blurClass = CONFIG.spoilerMode ? 'filter blur-sm' : '';
            imageSection = `
                <div class="mb-6 text-center">
                    <img src="${question.imageUrl}" 
                         alt="Question ${quizState.currentQuestionIndex + 1}" 
                         class="max-w-full h-48 object-cover rounded-lg mx-auto ${blurClass}" 
                         id="question-image">
                </div>
            `;
        }
        
        const optionsHTML = question.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            return `
                <button class="answer-btn p-4 md:p-5 text-left bg-gray-700 hover:bg-gray-600 active:bg-gray-600 rounded-lg md:rounded-xl transition-all duration-200 border-2 border-transparent hover:border-primary-500 active:scale-95 touch-manipulation" 
                        data-answer-index="${index}">
                    <div class="flex items-center space-x-3">
                        <span class="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm md:text-base">${letter}</span>
                        <span class="text-sm md:text-base leading-relaxed">${option}</span>
                    </div>
                </button>
            `;
        }).join('');
        
        const questionHTML = `
            <div class="question-container">
                <!-- Timer prominent en haut -->
                <div class="mb-6 flex justify-center">
                    <div class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-full px-6 py-3 shadow-lg">
                        <div class="flex items-center space-x-3">
                            <i class="bi bi-clock text-white text-lg"></i>
                            <span class="text-2xl font-bold text-white" id="timer-display-large">${quizState.timeRemaining}</span>
                            <span class="text-white text-sm">sec</span>
                        </div>
                    </div>
                </div>
                
                ${imageSection}
                
                <h3 class="text-xl md:text-2xl font-bold mb-6 text-center px-2">${question.question}</h3>
                
                <!-- Options améliorées pour mobile -->
                <div class="grid grid-cols-1 gap-3 md:gap-4 mb-6 px-2">
                    ${optionsHTML}
                </div>
                
                <!-- Progress bar -->
                <div class="mt-8 px-2">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm text-gray-400">Progression</span>
                        <span class="text-sm text-gray-400">${quizState.currentQuestionIndex + 1}/${quizState.questions.length}</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div class="bg-gradient-to-r from-primary-400 to-primary-500 h-2 rounded-full transition-all duration-300" 
                             style="width: ${((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100}%"></div>
                    </div>
                </div>
            </div>
        `;
        
        domManager.setContent('quizContent', questionHTML);
        domManager.updateQuizStats(
            quizState.currentQuestionIndex, 
            quizState.questions.length, 
            quizState.score, 
            quizState.timeRemaining
        );
        
        // Ajouter les écouteurs d'événements
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!quizState.isAnswered) {
                    this.selectAnswer(parseInt(btn.dataset.answerIndex));
                }
            });
        });
        
        this.startTimer();
    }

    startTimer() {
        quizState.timerInterval = setInterval(() => {
            quizState.timeRemaining--;
            
            const timerDisplay = document.getElementById('timer-display');
            const timerDisplayLarge = document.getElementById('timer-display-large');
            
            if (timerDisplay) {
                timerDisplay.textContent = quizState.timeRemaining;
            }
            
            if (timerDisplayLarge) {
                timerDisplayLarge.textContent = quizState.timeRemaining;
                
                const timerContainer = timerDisplayLarge.closest('.bg-gradient-to-r');
                
                if (quizState.timeRemaining <= 5) {
                    // Animation d'urgence
                    timerContainer?.classList.remove('from-primary-500', 'to-primary-600');
                    timerContainer?.classList.add('from-red-500', 'to-red-600', 'animate-pulse');
                } else if (quizState.timeRemaining <= 8) {
                    // Avertissement
                    timerContainer?.classList.remove('from-primary-500', 'to-primary-600');
                    timerContainer?.classList.add('from-yellow-500', 'to-orange-600');
                }
                
                // Vibration sur mobile pour les dernières secondes
                if (quizState.timeRemaining <= 3 && 'vibrate' in navigator) {
                    navigator.vibrate(100);
                }
            }
            
            if (quizState.timeRemaining <= 0) {
                clearInterval(quizState.timerInterval);
                if (!quizState.isAnswered) {
                    this.selectAnswer(-1); // Temps écoulé
                }
            }
        }, 1000);
    }

    selectAnswer(answerIndex) {
        if (quizState.isAnswered) return;

        // Enregistrer la réponse et arrêter le timer de la question
        quizState.recordAnswer(answerIndex);
        quizState.endQuestionTimer();

        quizState.setAnswered();
        
        const question = quizState.getCurrentQuestion();
        const answerButtons = document.querySelectorAll('.answer-btn');
        
        // Animation de sélection
        if (answerIndex >= 0) {
            const selectedButton = answerButtons[answerIndex];
            selectedButton?.classList.add('scale-95', 'ring-2', 'ring-primary-400');
        }
        
        // Délai pour l'animation de sélection
        setTimeout(() => {
            // Marquer les réponses avec animations améliorées
            answerButtons.forEach((btn, index) => {
                const isCorrect = index === question.answer;
                const isSelected = index === answerIndex;
                const letterSpan = btn.querySelector('span');
                
                btn.disabled = true;
                btn.classList.remove('hover:bg-gray-600', 'hover:border-primary-500');
                
                if (isCorrect) {
                    btn.classList.add('bg-green-600', 'border-green-400', 'shadow-lg');
                    letterSpan?.classList.add('bg-green-400');
                    // Animation de succès
                    btn.classList.add('animate-bounce');
                } else if (isSelected) {
                    btn.classList.add('bg-red-600', 'border-red-400');
                    letterSpan?.classList.add('bg-red-400');
                    // Animation d'échec
                    btn.style.animation = 'shake 0.5s ease-in-out';
                } else {
                    btn.classList.add('opacity-40', 'blur-sm');
                }
            });
            
            // Vérifier la réponse
            if (answerIndex === question.answer) {
                quizState.addScore();
                launchConfetti();
                this.showFeedbackMessage('Bonne réponse ! 🎉', 'success');
            } else if (answerIndex === -1) {
                this.showFeedbackMessage('Temps écoulé ! ⏰', 'timeout');
            } else {
                this.showFeedbackMessage('Mauvaise réponse 😔', 'error');
            }
            
            // Révéler l'image si en mode spoiler
            if (CONFIG.spoilerMode) {
                const questionImage = document.getElementById('question-image');
                if (questionImage) {
                    questionImage.classList.remove('blur-sm');
                    questionImage.classList.add('transition-all', 'duration-500');
                }
            }
            
            domManager.updateQuizStats(
                quizState.currentQuestionIndex, 
                quizState.questions.length, 
                quizState.score, 
                quizState.timeRemaining
            );
            
            // Passer à la question suivante après un délai
            setTimeout(() => {
                quizState.nextQuestion();
                this.showQuestion();
            }, 2500);
            
        }, 300);
    }

    showFeedbackMessage(message, type) {
        const feedbackColors = {
            success: 'from-green-400 to-emerald-500',
            error: 'from-red-400 to-pink-500',
            timeout: 'from-yellow-400 to-orange-500'
        };

        const feedback = document.createElement('div');
        feedback.className = `fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full text-white font-bold text-lg bg-gradient-to-r ${feedbackColors[type]} shadow-lg animate-bounce`;
        feedback.textContent = message;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }

    showLoadingMessage() {
        const loadingHTML = `
            <div class="text-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
                <p class="text-gray-300">Chargement des questions...</p>
            </div>
        `;
        domManager.setContent('quizContent', loadingHTML);
    }
}