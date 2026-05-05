from django.db import models
from django.contrib.auth.models import User

class Atividade(models.Model):

    DIFICULDADE_CHOICES = [
        ('facil', 'Fácil'),
        ('medio', 'Médio'),
        ('dificil', 'Difícil')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="atividades")
    nome = models.CharField(max_length=255)
    tipoDeAtividade = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    dificuldade = models.CharField(
        max_length=10,
        choices=DIFICULDADE_CHOICES,
        default='medio'
    )
    concluida = models.BooleanField(default=False)

    def __str__(self):
        return self.nome