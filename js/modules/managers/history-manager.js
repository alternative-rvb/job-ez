/**
 * Module de gestion de l'historique des résultats
 */

import { playerManager } from '../core/player.js';
import { domManager } from '../ui/dom.js';

export class HistoryManager {
    constructor(onBack) {
        this.onBack = onBack;
    }

    show() {
        const results = playerManager.getAllResults();
        const stats = playerManager.getStats();

        // Afficher l'historique
        domManager.showHistory();

        // Afficher les statistiques
        this.renderStats(stats);

        // Afficher la liste des résultats
        this.renderResults(results);

        // Ajouter l'écouteur du bouton retour
        const btnBack = document.getElementById('btn-back-from-history');
        if (btnBack) {
            btnBack.addEventListener('click', () => {
                if (this.onBack) {
                    this.onBack();
                }
            });
        }
    }

    renderStats(stats) {
        const statsContainer = document.getElementById('history-stats');
        if (!statsContainer) return;

        const statsHTML = `
            <div class="bg-gray-800 rounded-lg p-4 text-center">
                <p class="text-gray-400 text-sm">Quizzes terminés</p>
                <p class="text-3xl font-bold text-primary-400">${stats.totalQuizzes}</p>
            </div>
            <div class="bg-gray-800 rounded-lg p-4 text-center">
                <p class="text-gray-400 text-sm">Moyenne</p>
                <p class="text-3xl font-bold text-primary-400">${stats.averageScore}%</p>
            </div>
            <div class="bg-gray-800 rounded-lg p-4 text-center">
                <p class="text-gray-400 text-sm">Meilleur score</p>
                <p class="text-3xl font-bold text-green-400">${stats.bestScore}%</p>
            </div>
            <div class="bg-gray-800 rounded-lg p-4 text-center">
                <p class="text-gray-400 text-sm">Moins bon</p>
                <p class="text-3xl font-bold text-red-400">${stats.worstScore}%</p>
            </div>
        `;

        statsContainer.innerHTML = statsHTML;
    }

    renderResults(results) {
        const listContainer = document.getElementById('history-list');
        if (!listContainer) return;

        if (results.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center py-12">
                    <i class="bi bi-inbox text-6xl text-gray-600 mb-4"></i>
                    <p class="text-gray-400 text-lg">Aucun résultat pour le moment.</p>
                    <p class="text-gray-500">Lancez un quiz pour voir vos résultats ici !</p>
                </div>
            `;
            return;
        }

        // Trier par date décroissante (plus récents d'abord)
        const sortedResults = [...results].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        const resultsHTML = sortedResults.map(result => {
            const scoreClass = result.percentage >= 80 ? 'text-green-400' : 
                               result.percentage >= 60 ? 'text-yellow-400' : 'text-red-400';
            
            const date = playerManager.formatDate(result.date);

            return `
                <div class="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-white mb-1">${result.quizTitle}</h3>
                            <div class="flex gap-2 text-xs">
                                <span class="px-2 py-1 bg-gray-700 rounded text-gray-300">${result.difficulty}</span>
                                <span class="px-2 py-1 bg-gray-700 rounded text-gray-300">${result.category}</span>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-4xl font-bold ${scoreClass}">${result.percentage}%</p>
                            <p class="text-sm text-gray-400">${result.score}/${result.totalQuestions}</p>
                        </div>
                    </div>
                    <div class="flex justify-between items-center text-sm text-gray-400 pt-3 border-t border-gray-700">
                        <span><i class="bi bi-calendar mr-1"></i>${date}</span>
                        <span><i class="bi bi-hourglass-split mr-1"></i>${Math.round(result.timeSpent)}s</span>
                    </div>
                </div>
            `;
        }).join('');

        listContainer.innerHTML = resultsHTML;
    }
}
