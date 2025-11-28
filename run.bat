@echo off
title Run Capstone App

REM Jalankan frontend di window baru
start "Frontend Dev" cmd /k "cd /d D:\Joki_Result\FAIZ\capstone\frontend && npm run dev"

REM Jalankan backend di window baru
start "Backend Server" cmd /k "cd /d D:\Joki_Result\FAIZ\capstone\backend && npm start"

echo.
echo Frontend dan Backend telah dijalankan di window terpisah.
echo Tutup window ini jika tidak diperlukan.
pause