@echo off
echo ==================================================
echo   Lancement de l'app "Ile des PREVOTS" 
echo ==================================================
echo.
echo [1/3] Nettoyage des caches...
if exist .expo ( rmdir /s /q .expo )
echo.
echo [2/3] Verification des dependances (Indispensable)...
call npm install
echo.
echo [3/3] Demarrage d'Expo (Mode Tunnel)...
echo.
echo Rappel : Si vous avez un ecran blanc ou une erreur d'assets :
echo 1. Desinstallez Expo Go du telephone.
echo 2. Reinstallez-le.
echo 3. Scannez a nouveau.
echo.
:: Correctif pour l'erreur "body" sur Windows
set NODE_OPTIONS=--no-warnings --no-experimental-fetch
set EXPO_METRO_NO_PROXY=1
set EXPO_TUNNEL_PROXY_OPTIONS={"rejectUnauthorized":false}

npx expo start --tunnel --clear
pause
