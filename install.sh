#!/bin/bash

# Rulesync TypeScript Installation Script

echo "🚀 Installing Rulesync TypeScript..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Make CLI executable
chmod +x dist/index.js

echo "✅ Installation complete!"
echo ""
echo "🎉 You can now use rulesync with:"
echo "   node dist/index.js --help"
echo ""
echo "📚 For global installation, run:"
echo "   npm link"
echo ""
echo "📖 See EXAMPLE.md for usage examples."
