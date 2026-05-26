from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Gère l'affichage ET la mise à jour d'un utilisateur"""
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]
        read_only_fields = ["id"]
        extra_kwargs = {
            'email': {'required': True, 'allow_blank': False},
            'username': {'required': True, 'allow_blank': False}
        }

    def update(self, instance, validated_data):
        # Met à jour les champs reçus un par en utilisant les fonctions natives de Django
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class RegisterSerializer(serializers.ModelSerializer):
    """Pour valider l'inscription et créer l'utilisateur"""
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {
            'email': {'required': True, 'allow_blank': False},
            'username': {'required': True, 'allow_blank': False}
        }

    def create(self, validated_data):
        # On utilise la fonction de votre modèle d'authentification
        return User.objects.create_user(**validated_data)
    