from pyexpat import model
from rest_framework import serializers
from hangar18.models import User, Publication

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nome', 'email', 'password', 'bio', 'cargo']

class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = '__all__'

        