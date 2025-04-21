from rest_framework import serializers
from .models import Order

class OrdersSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    cart = serializers.PrimaryKeyRelatedField(read_only=True)  # Include cart field
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'total_price']