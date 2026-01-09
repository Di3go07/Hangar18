from pyexpat import model
from rest_framework import serializers
from hangar18.models import User, Publication
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from django.utils import timezone

class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nome', 'email', 'password', 'bio', 'cargo']

class publicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = '__all__'

    def validate_title(self, value):
        ''' Função para validar o campo do título antes de criar uma slug e controlar a exclusividade dessa '''

        queryset = Publication.objects.filter(title__iexact=value) # Busca por todos os títulos iguais

        if self.instance: #lida com a verificação do título caso tenha editado o elemento
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists(): #verifica nos objetos Publication se o título já foi usado
            raise ValidationError(f"Já existe uma publicação com o título '{value}'") #proibe caso exista o título

        return value    

    def create(self, validated_data):
        ''' Função para lidar com a criação de uma publicação. Cria uma slug única automaticamente com base no título da publicação e passa a data atual '''

        validated_data['slug'] = slugify(validated_data['title'])
        validated_data['date'] = timezone.now().date() #passa a data atual na criação

        return super().create(validated_data)

    def update(self, instance, validated_data):
        ''' Função para lidar com updates em publicações. Ele atualiza o slug automaticamente caso tenha um update no título e salva a data da edição'''

        if 'title' in validated_data:
            validated_data['slug'] = slugify(validated_data['title']) #cria o slug para o novo título

        validated_data['edited'] = timezone.now().date() #passa a data da edição

        return super().update(instance, validated_data)
