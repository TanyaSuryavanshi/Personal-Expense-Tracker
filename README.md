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

## Deployment (Render)

This repo includes a `render.yaml` blueprint that provisions everything needed:

- A **PostgreSQL** database (`expense-tracker-db`)
- The **Django API** as a web service (`expense-tracker-api`)
- The **React frontend** as a static site (`expense-tracker-web`)

### Steps

1. Push the latest code to GitHub (`https://github.com/TanyaSuryavanshi/Personal-Expense-Tracker`).
2. In the [Render dashboard](https://dashboard.render.com/), click **New → Blueprint** and select this repository. Render will detect `render.yaml` and create all three services.
3. After the first build, set these environment variables (Render marks them `sync: false` so you must enter them manually):
   - On `expense-tracker-api`:
     - `CORS_ALLOWED_ORIGINS` → e.g. `https://expense-tracker-web.onrender.com`
     - `DJANGO_CSRF_TRUSTED_ORIGINS` → e.g. `https://expense-tracker-web.onrender.com`
   - On `expense-tracker-web`:
     - `VITE_API_URL` → e.g. `https://expense-tracker-api.onrender.com/api`
4. Trigger a manual deploy on both services after setting the variables (the frontend must be rebuilt to bake `VITE_API_URL` into the bundle).
5. (Optional) Create a Django superuser by opening a shell on the API service:
   ```bash
   python manage.py createsuperuser
   ```

### What the blueprint does

- Runs `backend/build.sh` on every deploy → installs deps, collects static files, runs migrations.
- Serves the API with `gunicorn` and static assets via WhiteNoise.
- Builds the frontend with `npm run build` and serves `frontend/dist` as a static site with SPA fallback to `index.html`.

### Required env vars (summary)

Backend (`backend/.env.example`):
- `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`
- `DATABASE_URL` (auto-wired from the Render database)
- `CORS_ALLOWED_ORIGINS`, `DJANGO_CSRF_TRUSTED_ORIGINS`

Frontend (`frontend/.env.example`):
- `VITE_API_URL`

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
