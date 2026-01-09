from rest_framework import viewsets
from hangar18.models import User, Publication
from hangar18.serializers import userSerializer, publicationSerializer
from rest_framework.generics import ListAPIView

class userViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = userSerializer

class publicationViewSet(viewsets.ModelViewSet):
    queryset = Publication.objects.all()
    serializer_class = publicationSerializer
    

class publicationByAuthorView(ListAPIView):
    ''' 
    Filtrar as publicações a partir de um parâmetro com o nome do autor, para facilitar buscas e não ser necessário decorar o id de cada um
    '''
    serializer_class = publicationSerializer

    def get_queryset(self):
        autor = self.kwargs.get('autor') #resgata o parâmetro na URL
        return Publication.objects.filter(author__nome__icontains=autor) #acessa os dados do elemento na Foreing Key para consultar se o autor possue o nome passado



    
