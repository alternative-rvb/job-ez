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
            const isSpoilerMode = quizState.currentQuiz?.spoilerMode;
            const blurClass = isSpoilerMode ? 'filter blur-md' : '';
            const spoilerOverlay = isSpoilerMode ? `
                <div class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                    <div class="text-white text-center">
                        <i class="bi bi-eye-slash text-4xl mb-2"></i>
                    </div>
                </div>
            ` : '';
            
            imageSection = `
                <div class="mb-4 text-center relative overflow-hidden">
                    <img src="${question.imageUrl}" 
                         alt="Question ${quizState.currentQuestionIndex + 1}" 
                         class="max-w-full h-32 aspect-square object-cover rounded-lg mx-auto ${blurClass}" 
                         id="question-image">
                    ${spoilerOverlay}
                </div>
            `;
        }
        
        let optionsHTML = '';
        if (question.choices && question.choices.length > 0) {
            // Mode choix multiples
            optionsHTML = question.choices.map((option, index) => {
                const letter = String.fromCharCode(65 + index);
                const isHidden = CONFIG.freeMode ? 'hidden' : '';
                return `
                    <button class="answer-btn ${isHidden} px-4 py-2 md:p-5 text-left bg-gray-700 hover:bg-gray-600 active:bg-gray-600 rounded-lg md:rounded-xl transition-all duration-200 border-2 border-transparent hover:border-primary-500 active:scale-95 touch-manipulation" 
                            data-answer-index="${index}">
                        <div class="flex items-center space-x-3">
                            <span class="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm md:text-base">${letter}</span>
                            <span class="text-sm md:text-base leading-relaxed">${option}</span>
                        </div>
                    </button>
                `;
            }).join('');
        } else {
            // Mode réponse libre - affichage simple
            optionsHTML = `
                <div class="text-center py-8">
                    <p class="text-lg md:text-xl text-blue-400 font-medium">Réponse libre</p>
                    <p class="text-sm text-gray-400 mt-2">Cette question ne compte pas dans le score</p>
                </div>
            `;
        }
        
        const questionHTML = `
            <div class="question-container">
                <!-- Timer prominent en haut -->
                <div class="mb-4 flex justify-center">
                    <div class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-full px-6 py-3 shadow-lg">
                        <div class="flex items-center space-x-3">
                            <i class="bi bi-clock text-white text-lg"></i>
                            <span class="text-2xl font-bold text-white" id="timer-display-large">${quizState.timeRemaining}</span>
                            <span class="text-white text-sm">sec</span>
                        </div>
                    </div>
                </div>
                
                ${imageSection}
                
                <h3 class="text-xl md:text-2xl font-bold mb-4 text-center px-2">${question.question}</h3>
                
                <!-- Options améliorées pour mobile -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 px-2">
                    ${CONFIG.freeMode ? `
                        <div class="text-center py-4 px-6 bg-blue-900/30 border-2 border-blue-500/50 rounded-lg mb-4 md:col-span-2">
                            <i class="bi bi-lightbulb text-2xl text-blue-400 mb-2"></i>
                            <p class="text-blue-300 font-medium">Mode Libre activé</p>
                            <p class="text-blue-400 text-sm">Les réponses sont cachées. Réfléchissez bien !</p>
                        </div>
                    ` : ''}
                    ${optionsHTML}
                </div>
                
                <!-- Progress bar -->
                <div class="mt-4 px-2 mb-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-semibold text-white">Progression</span>
                        <span class="text-sm font-semibold text-white" id="question-progress">${quizState.currentQuestionIndex + 1}/${quizState.questions.length}</span>
                    </div>
                    <div class="w-full bg-gray-600 rounded-full h-4 overflow-hidden shadow-inner border border-gray-500">
                        <div class="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-md" 
                             id="question-progress-bar"
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
        
        // Pour les questions libres, aucun événement spécial - elles utilisent le timer normal
        
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
                    const question = quizState.getCurrentQuestion();
                    
                    // L'image sera révélée dans le modal de feedback
                    if (quizState.currentQuiz?.spoilerMode && question?.imageUrl) {
                        // Pas besoin d'action supplémentaire ici
                    }
                    
                    if (question && (!question.choices || question.choices.length === 0)) {
                        // Pour les questions libres, passer simplement à la suivante
                        this.handleFreeResponseMode();
                    } else {
                        this.selectAnswer(-1); // Temps écoulé pour les choix multiples
                    }
                }
            }
        }, 1000);
    }

    selectAnswer(answerIndex) {
        if (!quizState.isAnswered && quizState.questions && quizState.questions.length > 0) {
            const question = quizState.getCurrentQuestion();
            
            // Vérification de sécurité - pour les questions à choix multiples
            if (!question || !question.choices || question.choices.length === 0 || !question.correctAnswer) {
                console.error('Question data is invalid for multiple choice:', question);
                return;
            }
            
            // Afficher la popup de révélation d'image en mode spoiler
            if (quizState.currentQuiz?.spoilerMode && question.imageUrl) {
                // L'image sera affichée dans le modal de feedback normal
            }
            
            quizState.setAnswered(true);
            quizState.recordAnswer(answerIndex); // Enregistrer la réponse de l'utilisateur
            quizState.endQuestionTimer(); // Enregistrer le temps de cette question

            const answerButtons = document.querySelectorAll('.answer-btn');

            // En mode libre, révéler automatiquement la bonne réponse
            if (CONFIG.freeMode && answerIndex === -1) {
                this.revealCorrectAnswer(question);
                return;
            }

            // Logique normale pour le mode normal
            // Vérifier la réponse
            const correctAnswerIndex = question.choices.indexOf(question.correctAnswer);
            const isCorrect = correctAnswerIndex !== -1 && answerIndex === correctAnswerIndex;
            if (isCorrect) {
                quizState.addScore();
                quizState.recordAnswerCorrectness(true);
                this.showFeedbackMessage('Bonne réponse !', 'success', question, answerIndex);
            } else if (answerIndex === -1) {
                quizState.recordAnswerCorrectness(false);
                this.showFeedbackMessage('Temps écoulé ! ⏰', 'timeout', question, correctAnswerIndex);
            } else {
                quizState.recordAnswerCorrectness(false);
                // Afficher la bonne réponse si showResponse est activé
                this.showFeedbackMessage('Mauvaise réponse 😔', 'error', CONFIG.showResponse ? question : (quizState.currentQuiz?.spoilerMode ? question : null), correctAnswerIndex);
            }
            
            domManager.updateQuizStats(
                quizState.currentQuestionIndex, 
                quizState.questions.length, 
                quizState.score, 
                quizState.timeRemaining
            );
            
            this.handleNormalMode(answerIndex, question, answerButtons);
        }
    }

    revealCorrectAnswer(question) {
        // Afficher le popup avec juste le texte de la bonne réponse
        const correctAnswerText = question.correctAnswer;
        this.showFeedbackMessage(correctAnswerText, 'timeout');

        // Créer l'élément de révélation
        const correctAnswerIndex = question.choices.indexOf(question.correctAnswer);
        const revealHTML = `
            <div class="answer-reveal correct">
                <div class="text-2xl font-bold mb-2">Temps écoulé !</div>
                <div class="text-lg mb-2">La bonne réponse était :</div>
                <div class="text-xl font-semibold bg-green-600 text-white px-4 py-2 rounded-lg inline-block">
                    ${String.fromCharCode(65 + correctAnswerIndex)}) ${question.correctAnswer}
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
                const isCorrect = question.choices && question.correctAnswer ? question.choices[index] === question.correctAnswer : false;
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
            
            // Vérifier la réponse (déjà fait dans selectAnswer)
            // La logique de vérification a été déplacée vers selectAnswer pour éviter les doublons
            
            // Passer à la question suivante après un délai
            setTimeout(() => {
                quizState.nextQuestion();
                this.showQuestion();
            }, 2500);
            
        }, 300);
    }

    handleFreeResponseMode() {
        // Pour les questions libres, on ne compte pas de points
        quizState.setAnswered(true);
        quizState.recordAnswerCorrectness(false); // Marquer comme non compté dans le score
        quizState.endQuestionTimer();
        
        // Feedback simple
        this.showFeedbackMessage('Question informative - pas de points', 'neutral');
        
        // Désactiver les éléments si présents (pour compatibilité)
        const freeAnswerInput = document.getElementById('free-answer-input');
        const submitFreeAnswerBtn = document.getElementById('submit-free-answer');
        
        if (freeAnswerInput) {
            freeAnswerInput.disabled = true;
            freeAnswerInput.classList.add('opacity-50');
        }
        
        if (submitFreeAnswerBtn) {
            submitFreeAnswerBtn.disabled = true;
            submitFreeAnswerBtn.classList.add('opacity-50');
        }
        
        // Passer à la question suivante après un délai
        setTimeout(() => {
            quizState.nextQuestion();
            this.showQuestion();
        }, 2000);
    }

    showFeedbackMessage(message, type, question = null, answerIndex = null) {
        const feedbackColors = {
            success: 'from-green-400 to-emerald-500',
            error: 'from-red-400 to-pink-500',
            neutral: 'from-blue-400 to-cyan-500',
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
        let subtitle = '';
        let responseSection = '';
        let imageSection = '';

        // Ajouter l'image révélée en mode spoiler
        if (quizState.currentQuiz?.spoilerMode && question?.imageUrl) {
            imageSection = `
                <div class="mb-4">
                    <img src="${question.imageUrl}" 
                         alt="Image révélée" 
                         class="w-full max-w-sm aspect-square object-cover rounded-lg mx-auto">
                </div>
            `;
        }

        switch(type) {
            case 'success':
                icon = '🎉';
                title = 'Bonne réponse !';
                subtitle = message;
                // Afficher la réponse correcte avec le même style
                if (question && answerIndex !== null) {
                    responseSection = `
                        <div class="mt-4 p-3 bg-gray-700 border-2 border-green-500/50 rounded-lg">
                            <p class="text-sm text-gray-300 mb-2">Votre réponse:</p>
                            <p class="text-lg font-semibold text-green-400">
                                ${String.fromCharCode(65 + answerIndex)} : ${question.choices[answerIndex]}
                            </p>
                        </div>
                    `;
                }
                break;
            case 'error':
                icon = '❌';
                title = 'Mauvaise réponse';
                subtitle = message;
                // Afficher la bonne réponse si showResponse est activé et la question est disponible
                if (CONFIG.showResponse && question && answerIndex !== null) {
                    responseSection = `
                        <div class="mt-4 p-3 bg-gray-700 border-2 border-green-500/50 rounded-lg">
                            <p class="text-sm text-gray-300 mb-2">La bonne réponse était:</p>
                            <p class="text-lg font-semibold text-green-400">
                                ${String.fromCharCode(65 + answerIndex)} : ${question.choices[answerIndex]}
                            </p>
                        </div>
                    `;
                }
                break;
            case 'neutral':
                icon = '📝';
                title = 'Réponse enregistrée';
                subtitle = message;
                break;
            case 'timeout':
                icon = '⏰';
                title = 'Temps écoulé !';
                if (question && answerIndex !== null) {
                    // Mode normal : afficher avec lettrage
                    subtitle = 'Vous n\'avez pas eu le temps de répondre';
                    if (CONFIG.showResponse) {
                        responseSection = `
                            <div class="mt-4 p-3 bg-gray-700 border-2 border-green-500/50 rounded-lg">
                                <p class="text-sm text-gray-300 mb-2">La bonne réponse était:</p>
                                <p class="text-lg font-semibold text-green-400">
                                    ${String.fromCharCode(65 + answerIndex)} : ${question.choices[answerIndex]}
                                </p>
                            </div>
                        `;
                    }
                } else if (question) {
                    // Mode spoiler : afficher sans lettrage
                    subtitle = question.correctAnswer;
                } else {
                    subtitle = message;
                }
                break;
        }

        modalContent.innerHTML = `
            <div class="text-6xl mb-4">${icon}</div>
            <h3 class="text-2xl font-bold mb-4 bg-gradient-to-r ${feedbackColors[type]} bg-clip-text text-transparent">
                ${title}
            </h3>
            ${imageSection}
            <p class="text-xl text-gray-300 leading-relaxed">
                ${subtitle}
            </p>
            ${responseSection}
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

    updateProgressBar() {
        const progressElement = document.getElementById('question-progress');
        const progressBarElement = document.getElementById('question-progress-bar');
        
        if (progressElement && progressBarElement) {
            const current = quizState.currentQuestionIndex;
            const total = quizState.questions.length;
            const progressText = `${current + 1}/${total}`;
            const progressPercent = ((current + 1) / total) * 100;
            
            progressElement.textContent = progressText;
            progressBarElement.style.width = `${progressPercent}%`;
        }
    }
}