from rest_framework import viewsets
from hangar18.models import User, Publication
from hangar18.serializers import userSerializer, publicationSerializer
from rest_framework import generics

# -- Sets --

class userViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = userSerializer
    lookup_field = 'nome' #filtra os usuários pelo nome deles

class publicationViewSet(viewsets.ModelViewSet):
    queryset = Publication.objects.all()
    serializer_class = publicationSerializer
    lookup_field = 'slug' #filtra as publications pelo slug delas

# -- LISTAS --

class publicationByAuthorView(generics.ListAPIView):
    ''' 
    Filtrar as publicações a partir de um parâmetro com o nome do autor, para facilitar buscas e não ser necessário decorar o id de cada um
    '''
    serializer_class = publicationSerializer

    def get_queryset(self):
        autor = self.kwargs.get('autor') #resgata o parâmetro na URL
        queryset = Publication.objects.filter(author__nome__icontains=autor) #acessa os dados do elemento na Foreing Key para consultar os autores com o nome passado
        return queryset


    
