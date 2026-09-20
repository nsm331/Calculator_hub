#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

# Install project dependencies
pip install -r requirements.txt

# Collect static files for WhiteNoise
python manage.py collectstatic --no-input

# Run database migrations
python manage.py migrate

# Seed or update all 43 calculators and KaTeX articles (idempotent)
python manage.py seed_calculators
