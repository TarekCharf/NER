from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import SentenceViewSet

router = DefaultRouter()
router.register("sentences", SentenceViewSet, basename="sentences")

urlpatterns = [
    path("", include(router.urls)),
]