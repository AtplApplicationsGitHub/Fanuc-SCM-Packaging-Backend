"""
accounts/services.py
SonarQube Compliance:
- Business logic isolated from Views.
- Explicit error handling.
- No magic strings (Regex as constant).
"""
import re
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User

# Regex Constant for Password Complexity (SonarQube Rule: Constants over literals)
# At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
PASSWORD_REGEX = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$'

def get_tokens_for_user(user):
    """
    Generates JWT Access and Refresh tokens for a given user.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def login_user_service(email, password):
    """
    Handles the authentication process.
    1. Authenticates against DB using email/password.
    2. Checks if the user is active.
    3. Generates and returns JWT tokens.
    """
    # Authenticate uses the USERNAME_FIELD defined in models.py (which is email)
    user = authenticate(email=email, password=password)

    if user is None:
        raise AuthenticationFailed('Invalid email or password.')

    if not user.is_active:
        raise AuthenticationFailed('User account is disabled.')

    # Generate Tokens
    tokens = get_tokens_for_user(user)
    
    return user, tokens