# Script khoi dong AutoHub Backend tu dong gan JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.4\jbr"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   DANG KHOI DONG AUTOHUB BACKEND (JAVA 21)       " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

Set-Location $PSScriptRoot

Write-Host "[1/2] Kiem tra phien ban Java:" -ForegroundColor Yellow
java -version

Write-Host ""
Write-Host "[2/2] Dang chay Spring Boot Backend (Port 8080)..." -ForegroundColor Green
.\gradlew.bat bootRun

