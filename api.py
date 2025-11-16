#!/usr/bin/env python3
"""
Générateur d'index automatique pour les quiz
Usage: python3 api.py [generate-index]
"""

import os
import json
import sys
from datetime import datetime


def generate_quiz_index():
    """Génère automatiquement le fichier d'index des quiz"""
    data_dir = './js/data'
    index_file = os.path.join(data_dir, 'index.json')
    
    if not os.path.exists(data_dir):
        print(f"❌ Dossier {data_dir} non trouvé")
        return False
    
    # Scanner les fichiers JSON (sauf index.json)
    quiz_files = []
    categories = set()
    for filename in sorted(os.listdir(data_dir)):
        if filename.endswith('.json') and filename != 'index.json':
            quiz_id = filename[:-5]  # Enlever .json
            
            # Vérifier que le fichier a une structure valide
            try:
                with open(os.path.join(data_dir, filename), 'r', encoding='utf-8') as f:
                    quiz_data = json.load(f)
                    if 'config' in quiz_data and 'questions' in quiz_data:
                        quiz_files.append(quiz_id)
                        # Extraire la catégorie
                        category = quiz_data['config'].get('category')
                        if category:
                            categories.add(category)
                        print(f"✅ {quiz_id}: {quiz_data['config'].get('title', 'Sans titre')}")
                    else:
                        print(f"⚠️  {quiz_id}: Structure invalide (pas de config/questions)")
            except Exception as e:
                print(f"❌ {quiz_id}: Erreur lors de la lecture - {e}")
    
    # Générer le fichier d'index
    index_data = {
        "quizzes": quiz_files,
        "categories": sorted(list(categories)),
        "count": len(quiz_files),
        "lastUpdated": datetime.now().isoformat(),
        "generated_by": "api.py"
    }
    
    try:
        with open(index_file, 'w', encoding='utf-8') as f:
            json.dump(index_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n🎯 Index généré avec succès !")
        print(f"📁 Fichier: {index_file}")
        print(f"📊 {len(quiz_files)} quiz indexés")
        print(f"🏷️  Catégories trouvées: {', '.join(sorted(categories))}")
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la génération de l'index: {e}")
        return False


def main():
    """Point d'entrée principal"""
    if len(sys.argv) > 1 and sys.argv[1] == 'generate-index':
        print("� Génération de l'index des quiz...\n")
        success = generate_quiz_index()
        sys.exit(0 if success else 1)
    else:
        print("Usage:")
        print("  python3 api.py generate-index  # Génère l'index des quiz")
        print("\n� Ajoutez ce script à votre workflow de build pour automatiser l'indexation !")


if __name__ == "__main__":
    main()