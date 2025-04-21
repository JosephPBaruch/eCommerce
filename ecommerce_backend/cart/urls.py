from django.urls import path
from .views import CartViewSet, CartItemViewSet

urlpatterns = [
    path('', CartViewSet.as_view({'get': 'list', 'post': 'create'}), name='cart'),
    path('items/', CartItemViewSet.as_view({'get': 'list', 'post': 'create'}), name='cartitem'),
    path('items/<str:pk>/', CartItemViewSet.as_view({'put': 'update', 'delete': 'destroy'}), name='cartitem-detail'),
]