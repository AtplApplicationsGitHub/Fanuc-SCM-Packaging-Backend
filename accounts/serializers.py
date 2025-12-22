"""
accounts/serializers.py
SonarQube Compliance: Strict typing and validation.
"""
from rest_framework import serializers
from .models import User, Role

class UserSerializer(serializers.ModelSerializer):
    """
    Output Serializer: Defines what user data is sent back to the React frontend.
    """
    role_name = serializers.CharField(source='role.name', read_only=True)

    class Meta:
        model = User
        # ADDED 'is_superuser' below vvv
        fields = ['id', 'name', 'email', 'role_name', 'is_active', 'is_superuser']

class CreateUserSerializer(serializers.ModelSerializer):
    """
    Input Serializer: Handles User Creation with Password Hashing & Role Lookup.
    """
    role = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'role', 'is_active']

    def create(self, validated_data):
        role_name = validated_data.pop('role')
        password = validated_data.pop('password')
        role_instance, _ = Role.objects.get_or_create(name=role_name)
        
        user = User.objects.create_user(
            email=validated_data['email'],
            password=password,
            name=validated_data['name'],
            role=role_instance,
            is_active=validated_data.get('is_active', True)
        )
        return user

class UpdateUserSerializer(serializers.ModelSerializer):
    """
    Input Serializer: Handles Updates. Password is OPTIONAL here.
    """
    role = serializers.CharField(required=False)
    password = serializers.CharField(required=False, write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'role', 'is_active']

    def update(self, instance, validated_data):
        # 1. Handle Role Update
        if 'role' in validated_data:
            role_name = validated_data.pop('role')
            role_instance, _ = Role.objects.get_or_create(name=role_name)
            instance.role = role_instance

        # 2. Handle Password Update (Only if provided)
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)

        # 3. Handle Standard Fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)