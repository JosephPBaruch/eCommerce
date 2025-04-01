from django.urls import path
from .views import ProductViewSet, ProductListingViewSet

urlpatterns = [
    path('', ProductViewSet.as_view({'get': 'list', 'post': 'create'}), name='product-list'),
    path('<uuid:pk>/', ProductViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='product-detail'),
    path('listing/', ProductListingViewSet.as_view({'get': 'list'}), name='product-listing'),
]