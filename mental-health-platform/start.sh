#!/bin/bash

echo "===================================="
echo "Mental Health Platform - Startup"
echo "===================================="
echo ""

# Check if MongoDB is running
echo "[1/4] Checking MongoDB..."
if pgrep -x "mongod" > /dev/null
then
    echo "MongoDB is already running"
else
    echo "Starting MongoDB..."
    mongod --dbpath /data/db &
    sleep 5
fi

echo ""
echo "[2/4] Starting Backend..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

echo ""
echo "[3/4] Waiting for backend to start..."
sleep 15

echo ""
echo "[4/4] Starting Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "===================================="
echo "All services started!"
echo "===================================="
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8080"
echo "MongoDB:  localhost:27017"
echo ""
echo "Press Ctrl+C to stop all services..."

# Wait for user interrupt
trap "echo ''; echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
