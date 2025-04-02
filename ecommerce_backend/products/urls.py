from django.urls import path
from .views import ProductViewSet, ProductListingViewSet, UserProductViewSet, DeleteProductView

urlpatterns = [
    path('', ProductViewSet.as_view({'get': 'list', 'post': 'create'}), name='product-list'),
    path('<uuid:pk>/', ProductViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='product-detail'),
    path('listing/', ProductListingViewSet.as_view({'get': 'list'}), name='product-listing'),
    path('user-products/', UserProductViewSet.as_view({'get': 'list'}), name='user-product-list'),
    path('<uuid:pk>/delete/', DeleteProductView.as_view(), name='product-delete'),
]