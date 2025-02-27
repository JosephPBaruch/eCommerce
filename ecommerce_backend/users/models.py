import uuid
from django.db import models

class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=255, unique=True, blank=True)
    password = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = str(self.id)
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.username


