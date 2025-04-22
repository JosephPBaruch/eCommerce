# filepath: ecommerce_backend/urls.py
from django.urls import include, path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
   openapi.Info(
      title="eCommerce Backend API",
      default_version='v1',
      description="AUTHENTICATION INSTRUCTIONS: \n" \
      "To authenticate the swagger UI playground: \n\n" \
      "    1. use the /login and/or /register endpoint to obtain the access token\n" \
      "    2. copy the access key\n" \
      "    3. navigate to the swagger ui 'Authenticate' button and type, 'Bearer <paste access token here>'.\n\n" \
      "After, all other requests requiring authentication can be made."
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
   path('users/', include('users.urls')),
   path('products/', include('products.urls')),
   path('orders/', include('orders.urls')),
   path('cart/', include('cart.urls')),

   path('swagger/', schema_view.with_ui('swagger', cache_timeout=0)),
   re_path(r"^swagger(?P<format>\.json|\.yaml)$", schema_view.without_ui(cache_timeout=0), name="schema-json"),
]