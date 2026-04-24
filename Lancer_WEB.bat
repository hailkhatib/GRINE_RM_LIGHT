@echo off
title ILE DES PREVOTS - Mode WEB
echo ==================================================
echo   LANCEMENT DE L'APPLICATION (MODE WEB)
echo ==================================================
echo.

:: 1. Lancement du Proxy Netlify en arriere-plan
echo [1/2] Demarrage du Proxy Calendrier...
start "PROXY" cmd /c "netlify dev"

:: 2. Installation des modules manquants
echo [2/3] Verification des modules (Patientez)...
call npm install

:: 3. Lancement d'Expo en mode Web
echo [3/3] Ouverture de l'application dans le navigateur...
echo.
set NODE_OPTIONS=--no-warnings --no-experimental-fetch

:: On force le lancement sur le navigateur du PC
call npx expo start --web --clear

pause
