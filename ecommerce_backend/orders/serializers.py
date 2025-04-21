from rest_framework import serializers
from .models import Order

class OrdersSerializer(serializers.ModelSerializer):
    # cart = serializers.PrimaryKeyRelatedField(read_only=True)  # Include cart field
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['total_price']