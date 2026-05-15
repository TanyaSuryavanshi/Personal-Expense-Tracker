#!/usr/bin/env bash
set -o errexit

echo "----- Render build diagnostic -----"
echo "DATABASE_URL set?  $( [ -n "$DATABASE_URL" ] && echo YES || echo NO )"
echo "DJANGO_DEBUG     = ${DJANGO_DEBUG:-<unset>}"
echo "DJANGO_DB_SSL    = ${DJANGO_DB_SSL:-<unset>}"
echo "PYTHON_VERSION   = ${PYTHON_VERSION:-<unset>}"
echo "PWD              = $(pwd)"
echo "-----------------------------------"

pip install --upgrade pip
pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate --no-input
