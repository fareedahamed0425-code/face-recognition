@echo off
echo ===================================================
echo Starting Face ID + Blockchain Verification Pipeline
echo ===================================================

echo [1/2] Launching FastAPI Backend on http://localhost:8000 ...
start "Backend - FastAPI" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

echo [2/2] Launching React Vite Frontend on http://localhost:5173 ...
start "Frontend - Vite" cmd /k "cd frontend && npm run dev"

echo.
echo Application initialized!
echo Open your browser at http://localhost:5173
echo ===================================================
