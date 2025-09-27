/**
 * Configuration de l'application Quiz
 */

export const CONFIG = {
    timeLimit: 10,
    spoilerMode: false,
    questionsPath: 'js/data/',
    availableQuizzes: [
        {
            id: 'javascript-1',
            title: 'JavaScript Fondamentaux',
            description: 'Testez vos connaissances de base en JavaScript',
            icon: 'bi-code-slash',
            color: 'from-yellow-400 to-orange-500',
            difficulty: 'Débutant',
            questionCount: 20
        },
        {
            id: 'spongebob',
            title: 'Bob l\'Éponge',
            description: 'Tout sur votre éponge préférée de Bikini Bottom',
            icon: 'bi-emoji-smile',
            color: 'from-blue-400 to-cyan-500',
            difficulty: 'Facile',
            questionCount: 10
        },
        {
            id: 'animaux',
            title: 'Animaux',
            description: 'Découvrez le règne animal',
            icon: 'bi-bug',
            color: 'from-green-400 to-emerald-500',
            difficulty: 'Moyen',
            questionCount: 20
        },
        {
            id: 'entretien-dev-web-1',
            title: 'Entretien Dev Web',
            description: 'Questions d\'entretien pour développeur web',
            icon: 'bi-briefcase',
            color: 'from-purple-400 to-pink-500',
            difficulty: 'Difficile',
            questionCount: 15
        },
        {
            id: 'entretien-dev-web-2',
            title: 'Entretien Dev Web Avancé',
            description: 'Questions avancées d\'entretien pour développeur web',
            icon: 'bi-briefcase-fill',
            color: 'from-red-400 to-pink-500',
            difficulty: 'Expert',
            questionCount: 25
        }
    ]
};