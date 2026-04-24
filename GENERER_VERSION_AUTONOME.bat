@echo off
echo ==================================================
echo   PREPARATION DU LIVRABLE NETLIFY (AVEC PROXY)
echo ==================================================
echo.

echo [1/4] Creation des fichiers Web...
call npx expo export -p web
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR export. Lancez Lancer_DEBUG.bat avant.
    pause
    exit
)

echo.
echo [2/4] Preparation du dossier final...
if exist LIVRABLE_NETLIFY rd /s /q LIVRABLE_NETLIFY
mkdir LIVRABLE_NETLIFY
xcopy /e /y dist LIVRABLE_NETLIFY\
mkdir LIVRABLE_NETLIFY\netlify
mkdir LIVRABLE_NETLIFY\netlify\functions
copy netlify\functions\proxy-ical.js LIVRABLE_NETLIFY\netlify\functions\ /y
copy netlify.toml LIVRABLE_NETLIFY\ /y

echo.
echo [3/4] Installation du module Fetch pour le serveur...
echo (Patientez quelques secondes)
cd LIVRABLE_NETLIFY
call npm init -y > nul
call npm install node-fetch@2 > nul
cd ..

echo.
echo [4/4] TERMINE AVEC SUCCES !
echo.
echo =======================================================
echo   DERNIERE ETAPE :
echo =======================================================
echo 1. Un dossier "LIVRABLE_NETLIFY" a ete cree.
echo 2. Allez sur https://app.netlify.com/drop
echo 3. Glissez TOUT LE DOSSIER "LIVRABLE_NETLIFY" sur le site.
echo 4. Une fois en ligne, ouvrez le lien sur votre Android.
echo.
echo LA SYNCHRONISATION DEVRAIT ETRE PARFAITE !
echo =======================================================
pause
