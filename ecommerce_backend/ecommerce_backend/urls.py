# filepath: ecommerce_backend/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from django.urls import re_path
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import path, include

schema_view = get_schema_view(
   openapi.Info(
      title="eCommerce Backend API",
      default_version='v1',
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
   path('users/', include('users.urls')),
   path('products/', include('products.urls')),
   path('orders/', include('orders.urls')),

   path('swagger/', schema_view.with_ui('swagger', cache_timeout=0)),
   re_path(r"^swagger(?P<format>\.json|\.yaml)$", schema_view.without_ui(cache_timeout=0), name="schema-json"),
]