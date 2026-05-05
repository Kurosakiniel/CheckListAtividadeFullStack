from rest_framework.routers import DefaultRouter
from .viewsets import AtividadeViewSet

router = DefaultRouter()
router.register(r'atividades', AtividadeViewSet, basename='atividades')

urlpatterns = router.urls