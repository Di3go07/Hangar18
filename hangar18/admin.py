from django.contrib import admin
from hangar18.models import User, Publication

class userAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'email', 'password', 'cargo')
    list_display_links = ('id', 'nome',)
    list_per_page = 20
    search_fields = ('nome',)

admin.site.register(User, userAdmin)

class publicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'subtitle', 'author', 'artcileType', 'slug', 'date', 'edited')
    list_display_links = ('id', 'title', 'artcileType', )
    list_per_page = 20
    search_fields = ('title', )

admin.site.register(Publication, publicationAdmin)

