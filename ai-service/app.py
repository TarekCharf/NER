from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import json
import os
from groq import Groq

# Initialisation du client Cloud (Groq utilise l'environnement ou une clé directe)
client_cloud = Groq(api_key="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")

def call_cloud_fallback(text):
    """
    Appelle un LLM ultra-rapide dans le cloud pour extraire les entités
    si le modèle local a échoué.
    """
    prompt = f"""Tu es un expert en Darija marocaine. Extrais les entités de type PER (Personne), LOC (Lieu), ORG (Organisation) du texte suivant.
Texte : {text}

Réponds UNIQUEMENT sous la forme d'un tableau JSON valide, sans introduction ni conclusion, comme ceci :
[
  {{"entity_group": "LOC", "word": "Casablanca", "score": 1.0, "start": 12, "end": 22}}
]
"""
    try:
        completion = client_cloud.chat.completions.create(
            model="llama3-8b-8192", # Modèle ultra-léger et instantané
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0 # Force une réponse déterministe et stable
        )
        # On extrait la chaîne JSON renvoyée par le LLM
        response_text = completion.choices[0].message.content.strip()
        return json.loads(response_text)
    except Exception as e:
        print(f"Échec du Fallback Cloud : {e}")
        return []

app = Flask(__name__)
CORS(app)

print("⚡ Chargement du modèle Darija NER...")
# On charge en mode "none" pour récupérer les jetons bruts et maîtriser la fusion
ner_pipeline = pipeline(
    "token-classification",
    model="./best_darija_ner_model",
    tokenizer="./best_darija_ner_model",
    aggregation_strategy="none",
    device=-1  
)
print("✅ Modèle chargé !")

def custom_merge_entities(raw_predictions, text):
    """
    Algorithme personnalisé pour fusionner les subtokens de XLM-RoBERTa
    et nettoyer définitivement les caractères Unicode de SentencePiece (\u2581).
    """
    if not raw_predictions:
        return []

    merged_entities = []
    current_entity = None

    for pred in raw_predictions:
        entity_type = pred["entity"].split("-")[-1]
        word = pred["word"]
        start = int(pred["start"])
        end = int(pred["end"])
        score = float(pred["score"])

        # On détecte si c'est un sous-mot (ne commence pas par un espace SentencePiece)
        is_subword = not word.startswith(" ") and not word.startswith(" ") and not word.startswith("\u2581")
        
        # NETTOYAGE TOTAL des caractères spéciaux de XLM-RoBERTa
        clean_word = word.replace(" ", "").replace(" ", "").replace("\u2581", "")

        if current_entity and (is_subword or current_entity["entity_group"] == entity_type) and (start <= current_entity["end"] + 1):
            current_entity["word"] += clean_word
            current_entity["end"] = end
            current_entity["score"] = max(current_entity["score"], score)
        else:
            if current_entity:
                current_entity["word"] = current_entity["word"].strip()
                if current_entity["word"]:
                    merged_entities.append(current_entity)
            
            current_entity = {
                "entity_group": entity_type,
                "score": score,
                "word": clean_word,
                "start": start,
                "end": end
            }

    if current_entity:
        current_entity["word"] = current_entity["word"].strip()
        if current_entity["word"]:
            merged_entities.append(current_entity)

    return merged_entities

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/predict', methods=['POST'])
def predict_ner():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Veuillez fournir un paramètre 'text'"}), 400
    
    texte_utilisateur = data['text']
    
    try:
        # 1. Obtenir les prédictions brutes découpées
        raw_preds = ner_pipeline(texte_utilisateur)
        
        # 2. Appliquer notre fusion personnalisée
        entities_fusionnees = custom_merge_entities(raw_preds, texte_utilisateur)

        # 3. ROUTAGE : Si l'IA locale n'a rien trouvé du tout, on bascule sur le Cloud
        if not entities_fusionnees:
            print("⚠️ Confiance locale trop faible ou vide. Basculement vers le Cloud...")
            entities_fusionnees = call_cloud_fallback(texte_utilisateur)
        
        return jsonify({
            "text": texte_utilisateur,
            "entities": entities_fusionnees
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erreur : {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)