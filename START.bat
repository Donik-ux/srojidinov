@echo off
setlocal
title TOPEX - start

echo ============================================
echo   TOPEX texnikumi - launcher
echo ============================================
echo.

netstat -ano | findstr /C:"LISTENING" | findstr /C:":5000 " >nul
if not errorlevel 1 (
  echo [backend]  already running: http://localhost:5000
) else (
  echo [backend]  starting...
  pushd "%~dp0backend"
  start "TOPEX backend" cmd /k npm start
  popd
)

netstat -ano | findstr /C:"LISTENING" | findstr /C:":3000 " >nul
if not errorlevel 1 (
  echo [frontend] already running: http://localhost:3000
) else (
  echo [frontend] starting...
  pushd "%~dp0frontend"
  start "TOPEX frontend" cmd /k npm run dev
  popd
)

echo.
echo Site:  http://localhost:3000
echo Admin: http://localhost:3000/login   (admin / admin123)
echo.
echo Opening browser in 5 seconds...
ping -n 6 127.0.0.1 >nul
start "" http://localhost:3000

endlocal
