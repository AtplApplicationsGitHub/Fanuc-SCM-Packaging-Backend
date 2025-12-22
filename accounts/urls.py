# accounts/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginAPIView, UserViewSet

# Router automatically generates /users/, /users/{id}/ URLs
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('auth/login/', LoginAPIView.as_view(), name='login'),
    path('', include(router.urls)), # Includes the generated user routes
]