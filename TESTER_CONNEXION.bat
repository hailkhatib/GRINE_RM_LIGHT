@echo off
title TEST DE CONNEXION - ILE DES PREVOTS
echo ==================================================
echo   VERIFICATION DE LA CONNEXION TELEPHONE -> PC
echo ==================================================
echo.

:: 1. Recuperation de l'IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| find "IPv4"') do set IP=%%a
set IP=%IP: =%

echo Votre adresse IP PC est : %IP%
echo.
echo ETAPE A SUIVRE :
echo --------------------------------------------------
echo 1. Prenez votre telephone (connecte au MEME WIFI).
echo 2. Ouvrez le navigateur (Chrome ou Safari).
echo 3. Tapez l'adresse suivante : http://%IP%:8081/status
echo --------------------------------------------------
echo.
echo RESULTAT :
echo - Si vous voyez "packager-status:ready", le pare-feu est DEBLOQUE !
echo - Si ca tourne dans le vide, le pare-feu BLOQUE encore.
echo.
pause
