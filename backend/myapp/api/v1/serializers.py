from rest_framework import serializers
from models import Atividade

class AtividadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade
        fiels = '__all__'
        read_only_fields = ['user']