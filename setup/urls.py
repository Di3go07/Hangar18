from django.contrib import admin
from django.urls import path, include
from rest_framework import routers, permissions
from hangar18.views import userViewSet, publicationViewSet, publicationByAuthorView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

router = routers.DefaultRouter()
router.register('users', userViewSet, basename='users')
router.register('publications', publicationViewSet, basename='publications')

schema_view = get_schema_view(
   openapi.Info(
      title="Minha API",
      default_version='v1',
      description="Documentação da API com Swagger",
      terms_of_service="https://www.example.com/terms/",
      contact=openapi.Contact(email="contato@example.com"),
      license=openapi.License(name="MIT License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('autor/<str:autor>/', publicationByAuthorView.as_view()),  # rota para acessar publicações de cada autor
    path('', include(router.urls)), 
    path('swagger(<format>\.json|\.yaml)', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
