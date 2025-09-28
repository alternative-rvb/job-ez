#!/usr/bin/env python3
"""
API Vercel pour générer l'index des quiz
"""

import os
import json
from datetime import datetime
from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Génère et retourne l'index des quiz"""
        try:
            # Chemin vers le dossier des données
            data_dir = './js/data'
            
            # Scanner les fichiers JSON (sauf index.json)
            quiz_files = []
            if os.path.exists(data_dir):
                for filename in sorted(os.listdir(data_dir)):
                    if filename.endswith('.json') and filename != 'index.json':
                        quiz_id = filename[:-5]  # Enlever .json
                        
                        # Vérifier que le fichier a une structure valide
                        try:
                            with open(os.path.join(data_dir, filename), 'r', encoding='utf-8') as f:
                                quiz_data = json.load(f)
                                if 'config' in quiz_data and 'questions' in quiz_data:
                                    quiz_files.append({
                                        'id': quiz_id,
                                        'title': quiz_data['config'].get('title', 'Sans titre'),
                                        'count': len(quiz_data.get('questions', []))
                                    })
                        except Exception:
                            continue
            
            # Réponse JSON
            response_data = {
                "quizzes": [quiz['id'] for quiz in quiz_files],
                "details": quiz_files,
                "count": len(quiz_files),
                "lastUpdated": datetime.now().isoformat(),
                "generated_by": "vercel_api"
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(json.dumps(response_data, indent=2).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            
            error_response = {
                "error": str(e),
                "message": "Erreur lors de la génération de l'index"
            }
            self.wfile.write(json.dumps(error_response).encode())