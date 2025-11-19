/**
 * Palette de couleurs par catégorie
 * Cet objet est généré automatiquement basé sur l'index.json
 */

// Palette de couleurs prédéfinies pour les catégories
const COLOR_PALETTE = [
  {
    bg: 'from-amber-400 to-orange-400',
    badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
  },
  {
    bg: 'from-purple-400 to-indigo-400',
    badge: 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
  },
  {
    bg: 'from-green-400 to-emerald-400',
    badge: 'bg-green-500/20 text-green-300 border border-green-500/50'
  },
  {
    bg: 'from-blue-400 to-cyan-400',
    badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
  },
  {
    bg: 'from-pink-400 to-rose-400',
    badge: 'bg-pink-500/20 text-pink-300 border border-pink-500/50'
  },
  {
    bg: 'from-red-400 to-rose-400',
    badge: 'bg-red-500/20 text-red-300 border border-red-500/50'
  },
  {
    bg: 'from-violet-400 to-purple-400',
    badge: 'bg-violet-500/20 text-violet-300 border border-violet-500/50'
  },
  {
    bg: 'from-cyan-400 to-blue-400',
    badge: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
  },
  {
    bg: 'from-teal-400 to-green-400',
    badge: 'bg-teal-500/20 text-teal-300 border border-teal-500/50'
  },
  {
    bg: 'from-orange-400 to-red-400',
    badge: 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
  }
];

// Index JSON avec les catégories (chargé une seule fois)
let indexData = null;
let categoryColorMap = {};

/**
 * Charger les données d'index.json
 */
async function loadIndexData() {
  if (indexData) return indexData;
  
  try {
    const response = await fetch('js/data/index.json');
    if (!response.ok) throw new Error('Erreur lors du chargement de index.json');
    indexData = await response.json();
    return indexData;
  } catch (error) {
    console.error('❌ Erreur lors du chargement de index.json:', error);
    return null;
  }
}

/**
 * Initialiser le mapping des couleurs depuis l'index.json
 */
export async function initializeCategoryColors() {
  const data = await loadIndexData();
  
  if (data && data.categories && Array.isArray(data.categories)) {
    categoryColorMap = {};
    data.categories.forEach((category, index) => {
      const colorIndex = index % COLOR_PALETTE.length;
      categoryColorMap[category] = COLOR_PALETTE[colorIndex];
    });
    console.log('✅ Couleurs des catégories initialisées');
    return categoryColorMap;
  }
  return null;
}

/**
 * Obtenir les couleurs pour une catégorie
 */
export function getCategoryColors(category) {
  // Si pas encore chargé, utiliser une couleur par défaut basée sur le hash
  if (!categoryColorMap || Object.keys(categoryColorMap).length === 0) {
    const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = hash % COLOR_PALETTE.length;
    return COLOR_PALETTE[colorIndex];
  }
  
  return categoryColorMap[category] || {
    bg: 'from-gray-400 to-gray-500',
    badge: 'bg-gray-500/20 text-gray-300 border border-gray-500/50'
  };
}
