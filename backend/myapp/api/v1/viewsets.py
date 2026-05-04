from rest_framework import viewsets, permissions
from models import Atividade
from serializers import AtividadeSerializer

class AtividadeViewSet(viewsets.ModelViewSet):
    serializer_class = AtividadeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Atividade.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

