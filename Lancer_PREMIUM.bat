@echo off
title ILE DES PREVOTS - Mode PREMIUM
echo ==================================================
echo   LANCEMENT DE LA VERSION PREMIUM
echo ==================================================
echo.

set APP_VARIANT=premium
set NODE_OPTIONS=--no-warnings --no-experimental-fetch

echo [1/2] Demarrage du Proxy...
start "PROXY" cmd /c "npx netlify dev"

echo [2/2] Lancement de la version PREMIUM...
call npx expo start --web --clear

pause
