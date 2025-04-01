from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'type', 'brand', 'created_at', 'updated_at', 'user']
        read_only_fields = ['user']