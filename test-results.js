// Test rapide des données de résultats
const testData = {
    score: 8,
    totalQuestions: 10,
    totalTime: 45.5,
    quizTitle: 'Test Quiz',
    quizId: 'test',
    questions: [
        {
            question: 'Test question?',
            options: ['A', 'B', 'C', 'D'],
            correct: 0,
            userAnswer: 0,
            explanation: 'Test explanation'
        }
    ]
};

localStorage.setItem('quizResults', JSON.stringify(testData));
console.log('✅ Données de test sauvegardées');
console.log('Données:', JSON.parse(localStorage.getItem('quizResults')));
