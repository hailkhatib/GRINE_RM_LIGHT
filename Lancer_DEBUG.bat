@echo off
echo ==================================================
echo   MODE DEBOGAGE - Ile des PREVOTS
echo ==================================================
echo.
echo [1/4] Test de Node.js...
node -v
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Node.js n'est pas installe !
    pause
    exit
)

echo [2/4] Nettoyage force...
if exist .expo rmdir /s /q .expo
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if %ERRORLEVEL% NEQ 0 echo Note: Certains fichiers de cache sont verrouilles (ignorez).

echo.
echo [3/4] Installation des modules (Patientez)...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: L'installation npm a echoue.
    pause
    exit
)

echo.
echo [4/4] Lancement d'Expo...
:: Vérification de la structure
if not exist "src\App.jsx" (
    if not exist "src\App.js" (
        echo [ALERTE] src\App.jsx est INTROUVABLE sur le disque !
        echo Verifiez que le fichier est bien sauvegarde dans le dossier src.
    )
)

:: Désactive les logs qui causent l'erreur "body" et le fetch expérimental instable
set NODE_OPTIONS=--no-warnings --no-experimental-fetch
set EXPO_METRO_NO_PROXY=1
set EXPO_TUNNEL_PROXY_OPTIONS={"rejectUnauthorized":false}

cmd /k npx expo start --tunnel --clear
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo --------------------------------------------------
    echo ERREUR DETECTEE : Le serveur a plante.
    echo --------------------------------------------------
    pause
)
pause
