#!/bin/bash

echo "🚀 Starting KhmerGhost..."
echo "👑 Owner: JZYY (THE MASTER)"
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Run this script from khmerghost/ directory"
    exit 1
fi

# Start backend in background
echo "📡 Starting Backend..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
cd ..

# Wait for backend to start
sleep 3

# Start frontend in background
echo "🎨 Starting Frontend..."
cd frontend
npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ KhmerGhost is running!"
echo ""
echo "📡 Backend:  http://localhost:3000"
echo "🎨 Frontend: http://localhost:3001"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
echo "🛑 To stop:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to exit (servers will keep running)"
