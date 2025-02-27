import uuid 
from django.db import models
from users.models import User
from products.models import Product
class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name =  models.TextField(default="")
    description = models.TextField(default="")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)  
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = str(self.id)
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.username

