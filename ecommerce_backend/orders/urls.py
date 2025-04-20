from django.urls import path
from .views import OrdersViewSet

urlpatterns = [
    path('', OrdersViewSet.as_view({'get': 'list', 'post': 'create'}), name='order'),
]