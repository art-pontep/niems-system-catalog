#!/bin/bash

# System Catalog Dashboard - Local Development Server
# This script starts a local web server for development

echo "🚀 Starting System Catalog Dashboard..."
echo ""

# Check if port 8000 is already in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8000 is already in use!"
    echo "   Please stop the existing server or use a different port."
    exit 1
fi

# Detect available server
if command -v python3 &> /dev/null; then
    echo "✅ Using Python 3"
    echo "📡 Server running at: http://localhost:8000"
    echo "   Press Ctrl+C to stop"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Using Python"
    echo "📡 Server running at: http://localhost:8000"
    echo "   Press Ctrl+C to stop"
    echo ""
    python -m SimpleHTTPServer 8000
elif command -v php &> /dev/null; then
    echo "✅ Using PHP"
    echo "📡 Server running at: http://localhost:8000"
    echo "   Press Ctrl+C to stop"
    echo ""
    php -S localhost:8000
elif command -v npx &> /dev/null; then
    echo "✅ Using Node.js http-server"
    echo "📡 Server running at: http://localhost:8000"
    echo "   Press Ctrl+C to stop"
    echo ""
    npx http-server -p 8000
else
    echo "❌ No suitable HTTP server found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3: brew install python3"
    echo "  - Node.js: brew install node"
    echo "  - PHP: brew install php"
    echo ""
    exit 1
fi
