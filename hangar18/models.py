from django.db import models
from django.forms import CharField

class User(models.Model):
    class Cargo(models.TextChoices):
        AUTOR = 'autor'
        EDITOR = 'editor'
        ADMINISTRADOR = 'administrador'

    nome = models.CharField(max_length=100)
    email = models.EmailField()
    password = models.CharField(max_length=128)
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
    artcileType = models.CharField(
        choices = Types.choices,
        default = Types.NOTICIA
    )
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    date = models.DateField()
    edited = models.DateField(blank=True, null=True)