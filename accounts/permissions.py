# accounts/permissions.py
"""
accounts/permissions.py
SonarQube Compliance: Explicit Access Control
"""
from rest_framework import permissions

class IsSCMAdmin(permissions.BasePermission):
    """
    Custom Permission: Allows access only to users with the 'SCM Admin' role.
    """
    def has_permission(self, request, view):
        # 1. Authenticated Check
        if not request.user or not request.user.is_authenticated:
            return False
        
        # 2. Role Check (Safe Navigation)
        # We assume the user model has a 'role' relationship with a 'name' attribute
        if request.user.role and request.user.role.name == 'SCM Admin':
            return True
            
        return False