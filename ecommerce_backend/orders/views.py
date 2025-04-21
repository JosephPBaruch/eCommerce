from cart.models import Cart
from rest_framework import viewsets
from .models import Order
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import OrdersSerializer

class OrdersViewSet(viewsets.ModelViewSet):
    serializer_class = OrdersSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsAuthenticated()]
        return []

    def get_queryset(self):
        return Order.objects.filter()
    
    # def perform_create(self, serializer):
    #     cart_id = self.request.data.get('cart')  # Get cart ID from the request body
    #     if not cart_id:
    #         raise ValueError("Cart ID is required.")  # Raise an error if cart ID is missing
    #     cart = Cart.objects.get(id=cart_id)  # Fetch the cart instance
    #     order = serializer.save(cart=cart)  # Link cart to order
    #     total_price = sum(item.price * item.quantity for item in cart.items.all())  # Calculate total price from cart items
    #     order.total_price = total_price
    #     order.save()