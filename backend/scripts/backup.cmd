@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0.."
if not exist "..\backups" mkdir "..\backups"
echo [%date% %time%] Starting backup>>"..\backups\backup.log"
node scripts\backupDb.js >>"..\backups\backup.log" 2>&1
echo [%date% %time%] Exit code: !errorlevel!>>"..\backups\backup.log"
endlocal
