from django.urls import path
from .views import OrdersViewSet, CartOrdersView

urlpatterns = [
    path('', OrdersViewSet.as_view({'get': 'list', 'post': 'create'}), name='order'),
    path('<uuid:pk>/', OrdersViewSet.as_view({'get': 'list', 'put': 'update', 'delete': 'destroy'}), name='order-detail'),
    path('cart/', CartOrdersView.as_view(), name='cart-orders'),
    ]