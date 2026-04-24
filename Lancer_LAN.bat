@echo off
title ILE DES PREVOTS - Mode LAN (Local)
echo ==================================================
echo   LANCEMENT EN MODE LAN (SANS TUNNEL)
echo ==================================================
echo.

:: Nettoyage
if exist .expo rmdir /s /q .expo

:: Lancement du Proxy Netlify en arriere-plan
start "PROXY" cmd /c "netlify dev"

echo Demarrage d'Expo en mode local...
set NODE_OPTIONS=--no-warnings --no-experimental-fetch
set EXPO_METRO_NO_PROXY=1

:: Lancement sans tunnel
call npx expo start --clear
pause
