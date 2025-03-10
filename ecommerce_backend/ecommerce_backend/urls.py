# filepath: ecommerce_backend/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('users/', include('users.urls')),
    path('products/', include('products.urls')),
    path('orders/', include('orders.urls')),
]