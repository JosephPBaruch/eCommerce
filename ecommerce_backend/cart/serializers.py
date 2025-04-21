from rest_framework import serializers
from .models import Cart, CartItem

class CartSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    items = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = '__all__'
        read_only_fields = ['user']

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = '__all__'