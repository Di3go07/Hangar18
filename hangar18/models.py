from django.db import models
from django.forms import CharField
from django.utils.text import slugify
from django.core.exceptions import ValidationError

class User(models.Model):
    class Cargo(models.TextChoices):
        AUTOR = 'autor'
        EDITOR = 'editor'
        ADMINISTRADOR = 'administrador'

    nome = models.CharField(max_length=100)
    email = models.EmailField()
    password = models.CharField(max_length=128)
    bio = models.CharField(max_length=350)
    cargo = models.CharField(
        choices = Cargo.choices,
        default = Cargo.AUTOR
    )

class Publication(models.Model):
    class Types(models.TextChoices):
        NOTICIA = "noticia"
        MATERIA = "matéria"
        RESENHA = "resenha"

    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=250)
    author = models.ForeignKey(User, on_delete=models.PROTECT)
    articleType = models.CharField(
        choices = Types.choices,
        default = Types.NOTICIA
    )
    thumb = models.CharField()
    slug = models.SlugField(max_length=250, unique=True, blank=True, )
    date = models.DateField()
    edited = models.DateField(blank=True, null=True)

    def save(self, *args, **kwargs):
        ''' Função para definir comportamentos ao realizar um POST '''
        
        if Publication.objects.filter(title__iexact=self.title).exists():
            raise ValidationError(f"Já existe uma publicação com o título '{self.title}'") #proibe um título igual 

        self.slug = slugify(self.title) #cria automaticamente um slug

        super().save(*args, **kwargs)