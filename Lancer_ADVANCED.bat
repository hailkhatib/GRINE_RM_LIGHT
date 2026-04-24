@echo off
title ILE DES PREVOTS - Mode ADVANCED
echo ==================================================
echo   LANCEMENT DE LA VERSION ADVANCED
echo ==================================================
echo.

set APP_VARIANT=advanced
set NODE_OPTIONS=--no-warnings --no-experimental-fetch

echo [1/2] Demarrage du Proxy...
start "PROXY" cmd /c "npx netlify dev"

echo [2/2] Lancement de la version ADVANCED...
call npx expo start --web --clear

pause
