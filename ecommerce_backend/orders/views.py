from cart.models import Cart
from products.models import Product
from rest_framework import viewsets
from .models import Order
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import OrdersSerializer
from rest_framework.exceptions import PermissionDenied
# from .models import Product

class OrdersViewSet(viewsets.ModelViewSet):
    serializer_class = OrdersSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsAuthenticated()]
        return []

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You are not authorized to view these orders.")
        return Order.objects.filter(cart__user=user)

    def perform_create(self, serializer):
        order = serializer.save()
        cart = order.cart
        if cart:
            for item in cart.items.all():
                Product.objects.filter(id=item.product_id).update(status='archive')
