# filepath: products/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrdersViewSet

router = DefaultRouter()
router.register(r'orders', OrdersViewSet)

urlpatterns = [
    path('', include(router.urls)),
]