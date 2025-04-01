from rest_framework import viewsets
from rest_framework.mixins import ListModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer
from rest_framework.permissions import IsAuthenticated

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects
    # .filter(user=self.request.user) 
    # Apply this filter when creating a view for
    
    def perform_create(self, serializer):
        # serializer.save(user=self.request.user)
        serializer.save()

class ProductListingViewSet(ListModelMixin, GenericViewSet):
    queryset = Product.objects.all()

    def list(self, request, *args, **kwargs):
        products = self.queryset.values('id', 'image', 'description', 'price')
        return Response(products)