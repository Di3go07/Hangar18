from pyexpat import model
from rest_framework import serializers
from hangar18.models import User, Publication

class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nome', 'email', 'password', 'bio', 'cargo']

class publicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = '__all__'

        