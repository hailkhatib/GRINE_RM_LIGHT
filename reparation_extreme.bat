@echo off
title REPARATION EXTREME - Ile des PREVOTS
echo ==================================================
echo   REPARATION EXTREME DES COMPOSANTS
echo ==================================================
echo.
echo Ce processus peut durer plusieurs minutes.
echo Ne fermez pas cette fenetre.
echo.

echo [1/4] Suppression des anciens composants...
if exist node_modules (
    echo Nettoyage du dossier node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Suppression du fichier de verrouillage...
    del /f /q package-lock.json
)
if exist .expo (
    rmdir /s /q .expo
)
echo.

echo [2/4] Nettoyage du cache NPM...
call npm cache clean --force
echo.

echo [3/4] Reinstallation complete (Telechargement)...
echo Cela peut prendre du temps selon votre connexion...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    echo ERREUR : L'installation a encore echoue.
    echo Verifiez votre connexion Internet ou si un anti-virus bloque NPM.
    echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    pause
    exit
)

echo.
echo [4/4] Lancement de l'application...
npx expo start --tunnel --clear
pause
