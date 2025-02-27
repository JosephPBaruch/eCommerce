from rest_framework import viewsets
from .models import Order
from rest_framework.permissions import IsAuthenticated
from .serializers import OrdersSerializer

class OrdersViewSet(viewsets.ModelViewSet):
    serializer_class = OrdersSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)