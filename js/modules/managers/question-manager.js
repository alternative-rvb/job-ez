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
            imageSection = `
                <div class="mb-6 text-center">
                    <img src="${question.imageUrl}" 
                         alt="Question ${quizState.currentQuestionIndex + 1}" 
                         class="max-w-full h-48 object-cover rounded-lg mx-auto" 
                         id="question-image">
                </div>
            `;
        }
        
        const optionsHTML = question.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            const isHidden = CONFIG.spoilerMode ? 'hidden' : '';
            return `
                <button class="answer-btn ${isHidden} p-4 md:p-5 text-left bg-gray-700 hover:bg-gray-600 active:bg-gray-600 rounded-lg md:rounded-xl transition-all duration-200 border-2 border-transparent hover:border-primary-500 active:scale-95 touch-manipulation" 
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
                    ${CONFIG.spoilerMode ? `
                        <div class="text-center py-4 px-6 bg-blue-900/30 border-2 border-blue-500/50 rounded-lg mb-4">
                            <i class="bi bi-eye-slash text-2xl text-blue-400 mb-2"></i>
                            <p class="text-blue-300 font-medium">Mode Spoiler activé</p>
                            <p class="text-blue-400 text-sm">Les réponses sont cachées. Réfléchissez bien !</p>
                        </div>
                    ` : ''}
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

        // En mode spoiler, révéler automatiquement la bonne réponse
        if (CONFIG.spoilerMode && answerIndex === -1) {
            this.revealCorrectAnswer(question);
            return;
        }

        // Logique normale pour le mode normal
        this.handleNormalMode(answerIndex, question, answerButtons);
    }

    revealCorrectAnswer(question) {
        // Afficher le popup avec juste le texte de la bonne réponse
        const correctAnswerText = question.options[question.answer];
        this.showFeedbackMessage(correctAnswerText, 'timeout');

        // Créer l'élément de révélation
        const revealHTML = `
            <div class="answer-reveal correct">
                <div class="text-2xl font-bold mb-2">Temps écoulé !</div>
                <div class="text-lg mb-2">La bonne réponse était :</div>
                <div class="text-xl font-semibold bg-green-600 text-white px-4 py-2 rounded-lg inline-block">
                    ${String.fromCharCode(65 + question.answer)}) ${question.options[question.answer]}
                </div>
            </div>
        `;

        // Ajouter la révélation après les boutons de réponse
        const quizContent = document.getElementById('quizContent');
        if (quizContent) {
            const existingReveal = quizContent.querySelector('.answer-reveal');
            if (existingReveal) {
                existingReveal.remove();
            }
            quizContent.insertAdjacentHTML('beforeend', revealHTML);
        }

        // Délai avant de passer à la question suivante
        setTimeout(() => {
            quizState.nextQuestion();
            this.showQuestion();
        }, 3000);
    }

    handleNormalMode(answerIndex, question, answerButtons) {
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
                const correctAnswerText = `Réponse ${String.fromCharCode(65 + answerIndex)} : ${question.options[answerIndex]}`;
                this.showFeedbackMessage(correctAnswerText, 'success');
            } else if (answerIndex === -1) {
                this.showFeedbackMessage('Temps écoulé ! ⏰', 'timeout');
            } else {
                this.showFeedbackMessage('Mauvaise réponse 😔', 'error');
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

        // Créer l'overlay modal
        const overlay = document.createElement('div');
        overlay.className = 'feedback-modal-overlay';

        // Créer le contenu modal
        const modalContent = document.createElement('div');
        modalContent.className = 'feedback-modal-content';

        // Contenu du modal selon le type
        let icon = '';
        let title = '';

        switch(type) {
            case 'success':
                icon = '🎉';
                title = 'Bonne réponse !';
                break;
            case 'error':
                icon = '❌';
                title = 'Mauvaise réponse';
                break;
            case 'timeout':
                icon = '⏰';
                title = 'Temps écoulé !';
                break;
        }

        modalContent.innerHTML = `
            <div class="text-6xl mb-4">${icon}</div>
            <h3 class="text-2xl font-bold mb-4 bg-gradient-to-r ${feedbackColors[type]} bg-clip-text text-transparent">
                ${title}
            </h3>
            <p class="text-xl text-gray-300 leading-relaxed">
                ${message}
            </p>
        `;

        overlay.appendChild(modalContent);
        document.body.appendChild(overlay);

        // Supprimer le modal après 3 secondes
        setTimeout(() => {
            overlay.style.animation = 'fadeInModal 0.3s ease-out reverse';
            modalContent.style.animation = 'scaleInModal 0.3s ease-out reverse';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }, 3000);
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