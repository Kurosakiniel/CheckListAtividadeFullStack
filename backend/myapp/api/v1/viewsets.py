from rest_framework import viewsets, permissions
from myapp.models import Atividade
from myapp.api.v1.serializers import AtividadeSerializer

class AtividadeViewSet(viewsets.ModelViewSet):
    serializer_class = AtividadeSerializer
    permission_classes = [permissions.IsAuthenticated]
    # 🔥 A MÁGICA ESTÁ AQUI: Remove a paginação automática de 10 itens
    pagination_class = None 

    def get_queryset(self):
        # 1. Filtra apenas as atividades do usuário logado
        queryset = Atividade.objects.filter(user=self.request.user)
        
        # 2. Pega o parâmetro da URL (ex: ?concluida=false)
        concluida_param = self.request.query_params.get('concluida')

        if concluida_param is not None:
            # 3. Converte a string da URL para Booleano do Python
            is_concluida = concluida_param.lower() == 'true'
            queryset = queryset.filter(concluida=is_concluida)
        
        # 4. Ordena pelas mais recentes
        return queryset.order_by('-id')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)