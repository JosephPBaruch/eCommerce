import uuid
from django.db import models
from users.models import User
from products.models import Product

class Order(models.Model):
    STATUS_CHOICES = [
        ('Cart', 'Cart'),
        ('Bought', 'Bought'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    createDate = models.DateTimeField(auto_now=True)
    updateDate = models.DateTimeField(auto_now=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Cart')
    shipping_address = models.TextField(default="")
    billing_address = models.TextField(default="")

    def __str__(self):
        return f"Order {self.id} - {self.status}"

