from django.urls import path

from .views import AllUsersView, CurrentUserView, LoginView, RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('all/', AllUsersView.as_view(), name='all-users-list'),
    path('me/', CurrentUserView.as_view(), name='current-user-detail'),
]