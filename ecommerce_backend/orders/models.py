import uuid
from django.db import models
from cart.models import Cart
from datetime import datetime

class Order(models.Model):
    STATUS_CHOICES = [
        ('Received', 'Received'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)  # Allow null temporarily
    created_at = models.DateTimeField(default=datetime.now)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Received')

    def __str__(self):
        return f"Order {self.id} - {self.status}"