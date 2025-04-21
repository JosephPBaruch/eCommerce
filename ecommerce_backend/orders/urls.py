from django.urls import path
from .views import OrdersViewSet

urlpatterns = [
    path('', OrdersViewSet.as_view({'get': 'list', 'post': 'create'}), name='order'),
    path('<uuid:pk>/', OrdersViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='order-detail'),
]