from cart.models import Cart
from rest_framework import viewsets
from .models import Order
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import OrdersSerializer
from django.contrib.auth import get_user_model

class OrdersViewSet(viewsets.ModelViewSet):
    serializer_class = OrdersSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsAuthenticated()]
        return []

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        user = get_user_model().objects.get(username=self.request.user.username)
        cart_id = self.request.data.get('cart')  # Get cart ID from request
        cart = Cart.objects.get(id=cart_id)  # Fetch the cart instance
        order = serializer.save(user=user, cart=cart)  # Link cart to order
        total_price = sum(item.price * item.quantity for item in cart.items.all())  # Calculate total price from cart items
        order.total_price = total_price
        order.save()