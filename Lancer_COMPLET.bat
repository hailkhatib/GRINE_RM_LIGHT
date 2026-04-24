@echo off
title SERVEUR COMPLET - ILE DES PREVOTS
echo ==================================================
echo   LANCEMENT DES DEUX SERVEURS (PROXY + APP)
echo ==================================================
echo.

:: 1. Verification rapide
echo [1/3] Verification de l'environnement...
call node -v >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR : Node.js n'est pas installe !
    pause
    exit
)

:: 2. Lancement du Proxy Netlify
echo [2/3] Lancement du PROXY (Netlify)...
echo Une nouvelle fenetre va s'ouvrir pour le proxy.
:: On lance Netlify dans une fenetre separee qui restera ouverte
start "PROXY NETLIFY (Port 8888)" cmd /k "set NODE_OPTIONS=--no-warnings --no-experimental-fetch && netlify dev"

:: 3. Lancement d'Expo
echo [3/3] Lancement de l'APPLICATION (Expo)...
echo Patientez pendant le demarrage d'Expo...
echo.

:: Configuration pour eviter les crashs Windows
set NODE_OPTIONS=--no-warnings --no-experimental-fetch
set EXPO_METRO_NO_PROXY=1
set EXPO_TUNNEL_PROXY_OPTIONS={"rejectUnauthorized":false}

:: Lancement reel
call npx expo start --tunnel --clear

echo.
echo Si vous voyez ce message, c'est que le serveur Expo s'est arrete.
pause
