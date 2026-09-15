@echo off
title BLEX STUDIO - Servidor IA Local (Qwen 2.5) + App iPad + Tunel HTTPS
color 0B
echo ===================================================
echo   BLEX STUDIO - INICIANDO SERVICIO COMPLETO
echo   1. Servidor de IA: Qwen 2.5 (7B) en GPU
echo   2. Servidor Local iPad: http://192.168.1.10:3000
echo   3. Tunel HTTPS iPad/Vercel: https://blex-studio-ia.loca.lt
echo ===================================================
echo.
set OLLAMA_ORIGINS=*
set OLLAMA_HOST=0.0.0.0:11434
start "" "C:\Users\User\AppData\Local\Programs\Ollama\ollama.exe" serve
timeout /t 2 /nobreak >nul
cd /d "c:\Users\User\Desktop\git\content-script-studio"
start "" /B npx localtunnel --port 3000 --subdomain blex-studio-ia
node server.js
pause
