"""
accounts/models.py
SonarQube Compliance:
- Meaningful naming [cite: 4]
- No dead code [cite: 4]
- Normalized tables [cite: 7]
"""

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

class Role(models.Model):
    """
    Defines the roles available in the system (Sales Engineer, SCM Admin, etc).
    This allows for 'Configurable dropdown values' as requested.
    """
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class UserManager(BaseUserManager):
    """
    Custom manager to handle User creation with Email as the identifier.
    """
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model supporting Role-Based Access Control (RBAC).
    Replaces the default Django user to enforce Email as username.
    """
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=150)
    
    # Relationship to Role model (Normalized)
    # on_delete=PROTECT prevents deleting a Role if users are still assigned to it.
    role = models.ForeignKey(Role, on_delete=models.PROTECT, null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False) # Required for Django Admin
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email