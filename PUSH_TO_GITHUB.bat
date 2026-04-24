@echo off
title PUSH VERS GITHUB - GRINE RM
echo ==================================================
echo   PREPARATION DE L'ENVOI VERS GITHUB
echo ==================================================
echo.

:: Verification de Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Git n'est pas installe sur votre ordinateur.
    echo Veuillez l'installer sur https://git-scm.com/
    pause
    exit
)

echo [1/4] Initialisation du depot...
git init

echo [2/4] Preparation des fichiers...
git add .

echo [3/4] Creation du message...
git commit -m "Initial Deployment: Multi-variant Freemium Version"

echo [4/4] Connexion au lien distant...
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin https://github.com/hailkhatib/GRINE_RM_LIGHT.git

echo.
echo ==================================================
echo   ENVOI EN COURS... (Une fenetre de connexion peut s'ouvrir)
echo ==================================================
git push -u origin main

echo.
if %errorlevel% equ 0 (
    echo [SUCCES] Votre projet est maintenant sur GitHub !
) else (
    echo [ERREUR] L'envoi a echoue. Verifiez votre connexion ou vos droits.
)
echo.
pause
