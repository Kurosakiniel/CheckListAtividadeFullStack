from rest_framework import viewsets, permissions
from myapp.models import Atividade
from myapp.api.v1.serializers import AtividadeSerializer

class AtividadeViewSet(viewsets.ModelViewSet):
    serializer_class = AtividadeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # 1. Começamos filtrando apenas as atividades do usuário logado
        queryset = Atividade.objects.filter(user=self.request.user)
        
        # 2. Pegamos o parâmetro da URL (ex: ?concluida=false)
        concluida_param = self.request.query_params.get('concluida')

        if concluida_param is not None:
            # 3. Convertemos a string 'false'/'true' para o Booleano do Python
            is_concluida = concluida_param.lower() == 'true'
            queryset = queryset.filter(concluida=is_concluida)
        
        # 4. Ordenamos para as mais recentes aparecerem primeiro
        return queryset.order_by('-id')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)