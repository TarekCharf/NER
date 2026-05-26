import requests
from django.conf import settings
from rest_framework import status, viewsets, mixins
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json
from .models import Sentence, Entity
from .serializers import SentenceCreateSerializer, SentenceSerializer
import logging

logger = logging.getLogger(__name__)

class SentenceViewSet(mixins.ListModelMixin,
    mixins.RetrieveModelMixin,viewsets.GenericViewSet):

    permission_classes = [IsAuthenticated]
    serializer_class = SentenceSerializer

    def get_queryset(self):
        return Sentence.objects.filter(user=self.request.user).prefetch_related("entities").order_by('-created_at')
    
    # POST /api/sentences/analyze/
    @action(detail=False, methods=["post"], url_path="analyze")
    def analyze(self, request):
        # Sécurité : Si request.data est arrivé sous forme de chaîne brute (ex: JSON mal parsé par le middleware)
        data = request.data
        logger.info(f"=== DONNEES RECUES PAR DJANGO : {request.data} (Type: {type(request.data)}) ===")
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except json.JSONDecodeError:
                return Response({"error": "Le corps de la requête doit être un JSON valide."}, status=status.HTTP_400_BAD_REQUEST)

        text = data.get("text", "").strip() if isinstance(data, dict) else ""
        logger.info(f"=== TEXT EXTRAIT : {text} ===")
        # Si request.data est un dictionnaire classique
        if not text and isinstance(data, dict):
            text = data.get("text", "").strip()

        if not text:
            return Response({"error": "Le champ 'text' est requis et ne doit pas être vide."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            flask_response = requests.post(
                f"{settings.AI_SERVICE_URL}/api/predict",
                json={"text": text},
                timeout=30,
            )
            flask_response.raise_for_status()
            flask_data = flask_response.json()
        except requests.exceptions.ConnectionError:
            return Response({"error": "Service IA indisponible."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except requests.exceptions.Timeout:
            return Response({"error": "Le service IA a mis trop de temps à répondre."}, status=status.HTTP_504_GATEWAY_TIMEOUT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)

        # 2. Construction du payload pour le serializer
        payload = {
            "text": text,
            "entities": [
                {
                    "text": e["word"],
                    "start": e["start"],
                    "end": e["end"],
                    "label": e["entity_group"],  # "PER", "LOC", "ORG"
                }
                for e in flask_data.get("entities", [])
            ],
        }

        # 3. Sauvegarde via le serializer
        serializer = SentenceCreateSerializer(data=payload)
        serializer.is_valid(raise_exception=True)
        sentence = serializer.save(user=request.user)

        return Response(SentenceSerializer(sentence).data, status=status.HTTP_201_CREATED)

    # GET /api/sentences/
    def list(self, request):
        queryset = self.get_queryset()
        serializer = SentenceSerializer(queryset, many=True)
        return Response(serializer.data)

    # GET /api/sentences/{id}/
    def retrieve(self, request, pk=None):
        sentence = self.get_queryset().filter(pk=pk).first()
        if not sentence:
            return Response({"error": "Introuvable ou non autorisé."}, status=status.HTTP_404_NOT_FOUND)
        return Response(SentenceSerializer(sentence).data)
    
    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        # 1. Compter les phrases de l'utilisateur connecté
        total_sentences = Sentence.objects.filter(user=request.user).count()
        
        # 2. Compter le nombre total d'entités extraites dans ces phrases
        # (Adaptez 'sentences__user' ou la jointure selon vos modèles exacts)
        total_entities = Entity.objects.filter(sentence__user=request.user).count()
        
        # 3. Calculer ou simuler un taux de précision (ex: fixe ou basé sur un score de confiance)
        precision_rate = "95.4%" 

        return Response({
            "total_sentences": total_sentences,
            "total_entities": total_entities,
            "precision_rate": precision_rate
        })