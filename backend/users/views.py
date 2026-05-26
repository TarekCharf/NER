from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.parsers import JSONParser
from .serializers import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserViewSet(GenericViewSet):
    parser_classes = [JSONParser]

    def get_serializer_class(self):
        if self.action == "register":
            return RegisterSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action == "register":
            return [AllowAny()]
        return [IsAuthenticated()]

    # POST /users/register/
    @action(detail=False, methods=["post"], url_path="register", permission_classes=[AllowAny])
    def register(self, request):
        # 1. Le serializer prend les données et les valide automatiquement
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # 2. On enregistre l'utilisateur (déclenche la méthode create du serializer)
        user = serializer.save()
        
        # 3. Génération instantanée du Token JWT
        refresh = RefreshToken.for_user(user)
        
        # 4. On renvoie la réponse propre avec le token
        return Response({
            "status": "success",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

    # GET /users/me/
    # PATCH /users/me/
    @action(detail=False, methods=["get", "patch"], url_path="me")
    def me(self, request):
        if request.method == "GET":
            return Response(UserSerializer(request.user).data)

        # En passant 'instance=request.user', DRF comprend qu'il s'agit d'une MISE À JOUR (Update)
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()  # ✅ Déclenche la méthode update() du UserSerializer
        return Response(serializer.data)