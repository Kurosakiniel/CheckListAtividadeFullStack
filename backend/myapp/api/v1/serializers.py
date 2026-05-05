from rest_framework import serializers
from myapp.models import Atividade

class AtividadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade
        fields = '__all__'
        read_only_fields = ['user']