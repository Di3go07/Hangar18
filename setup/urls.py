from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from hangar18.views import userViewSet, publicationViewSet, publicationByAuthorView

router = routers.DefaultRouter()
router.register('users', userViewSet, basename='users')
router.register('publications', publicationViewSet, basename='publications')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('autor/<str:autor>/', publicationByAuthorView.as_view()), #rota para acessar publicações de cada autor
    path('',include(router.urls))
]
