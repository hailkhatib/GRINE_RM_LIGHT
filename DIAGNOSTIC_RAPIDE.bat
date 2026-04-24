@echo off
echo --- DIAGNOSTIC GRINE-RM ---
echo.
echo [1] Version Node.js:
node -v
echo.
echo [2] Fichiers a la racine:
dir /b App.js index.js App.jsx
echo.
echo [3] Fichiers dans src:
dir /b src\App.jsx src\App.js src\main.jsx
echo.
echo [4] Test de resolution Expo:
npx expo-doctor
echo.
echo ---------------------------
pause
