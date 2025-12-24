"""
Django settings for config project.
"""

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# 1. Define BASE_DIR first
BASE_DIR = Path(__file__).resolve().parent.parent

# 2. Explicitly load the .env file from the BASE_DIR
# Note: In Docker production, this file likely won't exist. 
# variables will be injected directly into the OS environment.
env_path = BASE_DIR / '.env'
load_dotenv(dotenv_path=env_path)

# 3. Read the Secret Key
# Production Update: No default value provided for safety. It must be in the Env.
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')

# Debug Check
if not SECRET_KEY:
    # Fallback only for local testing if absolutely necessary, but warn heavily
    print("WARNING: DJANGO_SECRET_KEY not found. Using unsafe dev key.")
    SECRET_KEY = 'unsafe-dev-key-for-testing-only'

# SECURITY WARNING: don't run with debug turned on in production!
# Cast string to boolean safely
DEBUG = os.getenv('DEBUG_MODE', 'False') == 'True'

# Production Update: Dynamic Hosts
# Example Env Var: ALLOWED_HOSTS=api.yoursite.com,127.0.0.1,localhost
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # --- Third Party Apps ---
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',

    # --- Local Apps ---
    'accounts',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be at the top
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database
# Production Update: HOST defaults to localhost, but can be an IP (e.g., 172.17.0.1)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'postgres'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'password'),
        'HOST': os.getenv('DB_HOST', 'localhost'), 
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'  # Added for production 'collectstatic'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- CUSTOM CONFIGURATION ---

# 1. Custom User Model
AUTH_USER_MODEL = 'accounts.User'

# 2. CORS Settings (Dynamic)
# Example Env Var: FRONTEND_URLS=https://www.yoursite.com,http://localhost:5173
frontend_urls = os.getenv('FRONTEND_URLS', 'http://localhost:5173').split(',')
CORS_ALLOWED_ORIGINS = frontend_urls

# CSRF Trusted Origins (Required for HTTPS POST requests from external domains)
CSRF_TRUSTED_ORIGINS = frontend_urls

# 3. DRF & JWT Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}