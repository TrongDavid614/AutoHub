@echo off
title AutoHub Backend Server
echo ===================================================
echo   DANG KHOI DONG AUTOHUB BACKEND (JAVA 21)
echo ===================================================

set "JAVA_HOME=C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.4\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"

cd /d "%~dp0"

echo [1/2] Kiem tra phien ban Java:
java -version
if %errorlevel% neq 0 (
    echo [LOI] Khong tim thay Java tai %JAVA_HOME%
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Dang chay Spring Boot Backend (Port 8080)...
call gradlew.bat bootRun

pause

