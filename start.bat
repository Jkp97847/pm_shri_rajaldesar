@echo off
title PM SHRI School Rajaldesar - Server
cd /d "%~dp0server"

echo ========================================================
echo   PM SHRI UNION CLUB GOVT GIRLS SR. SEC. SCHOOL
echo   RAJALDESAR (CHURU, RAJASTHAN) - WEBSITE SERVER
echo ========================================================
echo.
echo Starting Server at http://localhost:5000 ...
echo Default Admin Password: admin@rajaldesar123
echo.

start "" "http://localhost:5000"
node server.js
pause
