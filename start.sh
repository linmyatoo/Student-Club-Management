#!/bin/bash

echo "🚀 Starting Student Club Management Platform..."
echo ""

# Check if PostgreSQL is running
if ! pgrep -x "postgres" > /dev/null; then
    echo "⚠️  PostgreSQL is not running. Starting it..."
    brew services start postgresql@15
    sleep 2
fi

echo "✓ PostgreSQL is running"
echo ""

# Start backend in background
echo "📡 Starting Backend API (port 3001)..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

sleep 3

# Start frontend in background  
echo "💻 Starting Frontend (port 3000)..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

sleep 3

echo ""
echo "✅ Both servers are starting up!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "📡 Backend API: http://localhost:3001"
echo ""
echo "📋 Logs:"
echo "   Backend: tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop both servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
