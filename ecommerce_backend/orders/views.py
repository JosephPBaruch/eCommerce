from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
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

class CartOrdersView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        cart_orders = Order.objects.filter(user=request.user, status='cart')
        serializer = OrderSerializer(cart_orders, many=True)
        return Response(serializer.data)