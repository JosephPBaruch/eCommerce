# filepath: products/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(models.Model):
    name = models.CharField(max_length=255)
    id = models.CharField(max_length=255, primary_key=True)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.name


