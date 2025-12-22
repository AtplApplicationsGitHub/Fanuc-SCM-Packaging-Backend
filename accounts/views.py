"""
accounts/views.py
SonarQube Compliance: Thin views, strict error handling.
"""
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status

from .models import User
from .serializers import LoginSerializer, UserSerializer, CreateUserSerializer, UpdateUserSerializer
from .services import login_user_service
from .permissions import IsSCMAdmin

class LoginAPIView(APIView):
    """
    Module 1: User Login Endpoint.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        user, tokens = login_user_service(email=email, password=password)

        return Response({
            'message': 'Login successful',
            'tokens': tokens,
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)

class UserViewSet(ModelViewSet):
    """
    Module 8: User Management API.
    """
    queryset = User.objects.select_related('role').all().order_by('-id')
    
    # === STAGE 6: SECURE MODE (LOCKED) ===
    # Now that Frontend sends the Token, we re-enable security.
    permission_classes = [IsAuthenticated, IsSCMAdmin]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateUserSerializer
        if self.action in ['update', 'partial_update']:
            return UpdateUserSerializer
        return UserSerializer