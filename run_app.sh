#!/usr/bin/env bash
echo "==================================================="
echo "Starting Face ID + Blockchain Verification Pipeline"
echo "==================================================="

# Start backend in background
echo "[1/2] Launching FastAPI Backend on http://localhost:8000..."
cd backend && uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend
echo "[2/2] Launching React Vite Frontend on http://localhost:5173..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "Pipeline Console is running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "Press Ctrl+C to terminate both servers."

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
