from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from hangar18.models import User, Publication
from hangar18.serializers import UserSerializer, PublicationSerializer

class userViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class publicationViewSet(viewsets.ModelViewSet):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
