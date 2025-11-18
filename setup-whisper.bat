@echo off
setlocal enabledelayedexpansion

echo ================================================
echo 🎤 AI Voice Retention Agent - Whisper Setup
echo ================================================
echo.

REM Check if .env exists
if not exist "backend\.env" (
    echo ❌ backend\.env not found!
    echo    Please copy backend\config.example to backend\.env first
    pause
    exit /b 1
)

echo This script will help you enable OpenAI Whisper transcription.
echo.
echo 📝 You need an OpenAI API key from: https://platform.openai.com/api-keys
echo.

REM Check if OPENAI_API_KEY already exists
findstr /C:"OPENAI_API_KEY=" backend\.env >nul 2>&1
if !errorlevel! equ 0 (
    echo ✅ OPENAI_API_KEY already configured in .env
    for /f "tokens=2 delims==" %%a in ('findstr /C:"OPENAI_API_KEY=" backend\.env') do set current_key=%%a
    if "!current_key!"=="sk-your-openai-api-key-here" (
        echo ⚠️  But it appears to be a placeholder value
        set /p update_key="Do you want to update it? (y/n): "
        if /i not "!update_key!"=="y" exit /b 0
    ) else (
        echo    Key configured
        set /p change_key="Do you want to change it? (y/n): "
        if /i not "!change_key!"=="y" exit /b 0
    )
)

REM Prompt for API key
echo.
set /p api_key="Enter your OpenAI API key (sk-...): "

if "!api_key!"=="" (
    echo ❌ No API key provided
    pause
    exit /b 1
)

REM Check if key starts with sk-
echo !api_key! | findstr /B /C:"sk-" >nul
if errorlevel 1 (
    echo ⚠️  Warning: OpenAI API keys usually start with 'sk-'
    set /p continue_anyway="Continue anyway? (y/n): "
    if /i not "!continue_anyway!"=="y" exit /b 1
)

REM Update or add the API key
findstr /C:"OPENAI_API_KEY=" backend\.env >nul 2>&1
if !errorlevel! equ 0 (
    REM Update existing - create temp file
    (for /f "delims=" %%a in (backend\.env) do (
        set "line=%%a"
        if "!line:OPENAI_API_KEY=!"=="!line!" (
            echo !line!
        ) else (
            echo OPENAI_API_KEY=!api_key!
        )
    )) > backend\.env.tmp
    move /y backend\.env.tmp backend\.env >nul
) else (
    REM Add new
    echo. >> backend\.env
    echo # OpenAI Whisper Fallback >> backend\.env
    echo OPENAI_API_KEY=!api_key! >> backend\.env
    echo USE_OPENAI_WHISPER=false >> backend\.env
)

echo.
echo ✅ OpenAI API key configured!
echo.

REM Ask about USE_OPENAI_WHISPER
set /p always_use="Always use OpenAI Whisper (vs Databricks fallback)? (y/n): "
if /i "!always_use!"=="y" (
    findstr /C:"USE_OPENAI_WHISPER=" backend\.env >nul 2>&1
    if !errorlevel! equ 0 (
        (for /f "delims=" %%a in (backend\.env) do (
            set "line=%%a"
            if "!line:USE_OPENAI_WHISPER=!"=="!line!" (
                echo !line!
            ) else (
                echo USE_OPENAI_WHISPER=true
            )
        )) > backend\.env.tmp
        move /y backend\.env.tmp backend\.env >nul
    ) else (
        echo USE_OPENAI_WHISPER=true >> backend\.env
    )
    echo ✅ Set to always use OpenAI Whisper
) else (
    echo ✅ Will use OpenAI Whisper as fallback for WebM audio only
)

REM Install form-data if needed
echo.
echo 📦 Checking dependencies...
cd backend
call npm list form-data >nul 2>&1
if errorlevel 1 (
    echo    Installing form-data package...
    call npm install form-data
) else (
    echo    ✅ form-data already installed
)
cd..

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Restart your backend server: cd backend ^&^& npm start
echo 2. Refresh your browser
echo 3. Try recording audio - it should work now!
echo.
echo Check console logs to see which Whisper service is being used.
echo.
pause

