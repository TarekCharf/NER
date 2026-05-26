from rest_framework import serializers
from .models import Sentence, Entity


class EntitySerializer(serializers.ModelSerializer):
    label_display = serializers.CharField(source="get_label_display", read_only=True)

    class Meta:
        model = Entity
        fields = ["id", "text", "start", "end", "label", "label_display"]


class SentenceSerializer(serializers.ModelSerializer):
    # Lit les entités associées grâce à la clé inverse 'related_name="entities"'
    entities = EntitySerializer(many=True, read_only=True)

    class Meta:
        model = Sentence
        fields = ["id", "text", "entities"]


class SentenceCreateSerializer(serializers.ModelSerializer):
    """Création d'une sentence + ses entities associées en une seule transaction"""
    entities = EntitySerializer(many=True, required=False)

    class Meta:
        model = Sentence
        fields = ["id", "text", "entities"]

    def create(self, validated_data):
        # 1. On extrait le tableau d'entités envoyé par la vue
        entities_data = validated_data.pop("entities", [])

        # 2. On crée l'objet principal Sentence (validated_data contient 'text' et 'user')
        sentence = Sentence.objects.create(**validated_data)

        # 3. On crée chaque entité en lui passant l'instance 'sentence' créée ci-dessus
        for entity_data in entities_data:
            Entity.objects.create(sentence=sentence, **entity_data)

        return sentence