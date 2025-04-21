import uuid
from django.db import models
from django.contrib.auth import get_user_model
from datetime import datetime

User = get_user_model()

class Cart(models.Model):
    STATUS_CHOICES = [
        ('Cart', 'Cart'),
        ('Paid', 'Paid'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField( default=datetime.now)  # Added default for existing rows
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    shipping_address = models.TextField(default="")
    billing_address = models.TextField(default="")

    def __str__(self):
        return f"Cart {self.id}"

class CartItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product_id = models.UUIDField()
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"CartItem {self.id} - Cart {self.cart.id}"