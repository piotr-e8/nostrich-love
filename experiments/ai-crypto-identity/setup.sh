#!/bin/bash

echo "🎸 Riff AI Identity - Setup Script"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install docker-compose first."
    exit 1
fi

# Create directories
echo "📁 Creating directories..."
mkdir -p ~/.config/riff
mkdir -p strfry-data

# Start the relay
echo "🚀 Starting local relay (strfry)..."
docker-compose up -d

# Wait for relay to be ready
echo "⏳ Waiting for relay to start..."
sleep 5

# Check if relay is running
if docker ps | grep -q riff-relay; then
    echo "✅ Relay is running on ws://localhost:7777"
else
    echo "❌ Failed to start relay"
    docker-compose logs
    exit 1
fi

echo ""
echo "🎸 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run: npm run demo"
echo "  2. Or: npx tsx identity-test.ts"
echo ""
echo "Storage locations:"
echo "  Identity: ~/.config/riff/"
echo "  Relay data: ./strfry-data/"
echo ""
echo "To stop relay: docker-compose down"
