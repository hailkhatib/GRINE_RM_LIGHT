@echo off
title DIAGNOSTIC RESEAU - Ile des PREVOTS
echo ==================================================
echo   DIAGNOSTIC DE CONNEXION NPM
echo ==================================================
echo.

echo [1/4] Test de ping vers Google (Internet general)...
ping google.com -n 2
if %ERRORLEVEL% NEQ 0 (echo [ECHEC] Internet semble coupe.) else (echo [OK] Internet fonctionne.)

echo.
echo [2/4] Test de ping vers le registre NPM (Composants)...
ping registry.npmjs.org -n 2
if %ERRORLEVEL% NEQ 0 (echo [ECHEC] Le serveur NPM est bloque par votre reseau ou pare-feu.) else (echo [OK] Le serveur NPM est accessible.)

echo.
echo [3/4] Verification de la configuration NPM...
call npm config get registry
echo Emplacement du cache :
call npm config get cache

echo.
echo [4/4] Test de telechargement reel (Bref)...
call npm view expo version
if %ERRORLEVEL% NEQ 0 (echo [ECHEC] Impossible de lire les informations d'Expo.) else (echo [OK] Lecture des infos Expo reussie.)

echo.
echo ==================================================
echo Diagnostic termine.
echo Merci de me copier ce qui est ecrit ci-dessus.
echo ==================================================
pause
