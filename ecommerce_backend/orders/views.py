# filepath: products/views.py
from rest_framework import viewsets
from .models import Product
from .serializers import OrdersSerializer

class OrdersViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = OrdersSerializer