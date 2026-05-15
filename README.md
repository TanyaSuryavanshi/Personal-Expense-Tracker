# Personal Expense Tracker

A full-stack personal expense tracker built with Django, Django REST Framework, PostgreSQL, React, Vite, and Tailwind CSS.

## Backend

### Setup
1. Create and activate a Python virtual environment.
2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Configure PostgreSQL settings in your environment:
   - `POSTGRES_DB`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_HOST`
   - `POSTGRES_PORT`
   - `DJANGO_SECRET_KEY`
   - `DJANGO_DEBUG`

4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```
6. Start the backend server:
   ```bash
   python manage.py runserver
   ```

## Frontend

### Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

## Features

- JWT authentication with signup/login/logout
- Add, edit, delete income and expense transactions
- Dashboard showing income, expenses, savings, and recent transactions
- Category analytics and monthly trends using Recharts
- Budget management with custom limits
- Filter transactions by category and date
- Export CSV and PDF from the frontend
- Responsive UI 
- REST API endpoints for all backend operations
