"""
WSGI config for calculator_net project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os
import sys
from pathlib import Path

# Ensure root directory is in sys.path
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from django.core.wsgi import get_wsgi_application

if os.path.exists(BASE_DIR / 'settings.py'):
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'calculator_net.settings')

application = get_wsgi_application()
