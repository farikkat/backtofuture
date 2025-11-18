#!/bin/bash

echo "🎤 AI Voice Retention Agent - Whisper Setup"
echo "==========================================="
echo ""

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "❌ backend/.env not found!"
    echo "   Please copy backend/config.example to backend/.env first"
    exit 1
fi

echo "This script will help you enable OpenAI Whisper transcription."
echo ""
echo "📝 You need an OpenAI API key from: https://platform.openai.com/api-keys"
echo ""

# Check if OPENAI_API_KEY already exists
if grep -q "^OPENAI_API_KEY=" backend/.env 2>/dev/null; then
    echo "✅ OPENAI_API_KEY already configured in .env"
    current_key=$(grep "^OPENAI_API_KEY=" backend/.env | cut -d'=' -f2)
    if [ "$current_key" == "sk-your-openai-api-key-here" ] || [ -z "$current_key" ]; then
        echo "⚠️  But it appears to be a placeholder value"
        read -p "Do you want to update it? (y/n): " update_key
        if [ "$update_key" != "y" ]; then
            exit 0
        fi
    else
        echo "   Key starts with: ${current_key:0:20}..."
        read -p "Do you want to change it? (y/n): " change_key
        if [ "$change_key" != "y" ]; then
            exit 0
        fi
    fi
else
    echo "➕ Adding OPENAI_API_KEY to .env"
fi

# Prompt for API key
echo ""
read -p "Enter your OpenAI API key (sk-...): " api_key

if [ -z "$api_key" ]; then
    echo "❌ No API key provided"
    exit 1
fi

if [[ ! "$api_key" =~ ^sk- ]]; then
    echo "⚠️  Warning: OpenAI API keys usually start with 'sk-'"
    read -p "Continue anyway? (y/n): " continue_anyway
    if [ "$continue_anyway" != "y" ]; then
        exit 1
    fi
fi

# Update or add the API key
if grep -q "^OPENAI_API_KEY=" backend/.env; then
    # Update existing
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^OPENAI_API_KEY=.*|OPENAI_API_KEY=$api_key|" backend/.env
    else
        # Linux/Windows Git Bash
        sed -i "s|^OPENAI_API_KEY=.*|OPENAI_API_KEY=$api_key|" backend/.env
    fi
else
    # Add new
    echo "" >> backend/.env
    echo "# OpenAI Whisper Fallback" >> backend/.env
    echo "OPENAI_API_KEY=$api_key" >> backend/.env
    echo "USE_OPENAI_WHISPER=false" >> backend/.env
fi

echo ""
echo "✅ OpenAI API key configured!"
echo ""

# Ask about USE_OPENAI_WHISPER
read -p "Always use OpenAI Whisper (vs Databricks fallback)? (y/n): " always_use
if [ "$always_use" == "y" ]; then
    if grep -q "^USE_OPENAI_WHISPER=" backend/.env; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|^USE_OPENAI_WHISPER=.*|USE_OPENAI_WHISPER=true|" backend/.env
        else
            sed -i "s|^USE_OPENAI_WHISPER=.*|USE_OPENAI_WHISPER=true|" backend/.env
        fi
    else
        echo "USE_OPENAI_WHISPER=true" >> backend/.env
    fi
    echo "✅ Set to always use OpenAI Whisper"
else
    echo "✅ Will use OpenAI Whisper as fallback for WebM audio only"
fi

# Install form-data if needed
echo ""
echo "📦 Checking dependencies..."
cd backend
if ! npm list form-data >/dev/null 2>&1; then
    echo "   Installing form-data package..."
    npm install form-data
else
    echo "   ✅ form-data already installed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Restart your backend server: cd backend && npm start"
echo "2. Refresh your browser"
echo "3. Try recording audio - it should work now!"
echo ""
echo "Check console logs to see which Whisper service is being used."

