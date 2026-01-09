from django.contrib import admin
from hangar18.models import User, Publication

class userAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'email', 'password', 'bio', 'cargo')
    list_display_links = ('id', 'nome', 'cargo')
    list_per_page = 20
    search_fields = ('nome',)

admin.site.register(User, userAdmin)

class publicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'subtitle', 'author', 'articleType', 'thumb', 'slug', 'date', 'edited')
    list_display_links = ('id', 'title', 'articleType', )
    list_per_page = 20
    search_fields = ('title', )
    list_filter = ('date', 'author')
    ordering = ('-date',)

admin.site.register(Publication, publicationAdmin)

