@echo off
REM AllergySafety - Script de inicio para Windows
REM Este script inicia tanto el servidor como el cliente

echo.
echo ========================================
echo    AllergySafety - Full Stack
echo ========================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado
    echo Descarga desde: https://nodejs.org/
    pause
    exit /b 1
)

echo [✓] Node.js detectado
echo.

REM Verificar si npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm no está instalado
    pause
    exit /b 1
)

echo [✓] npm detectado
echo.

REM Verificar si las carpetas existen
if not exist "AllergySafety-Server" (
    echo [ERROR] Carpeta AllergySafety-Server no encontrada
    pause
    exit /b 1
)

if not exist "AllergySafety-Client" (
    echo [ERROR] Carpeta AllergySafety-Client no encontrada
    pause
    exit /b 1
)

echo [✓] Estructura de carpetas correcta
echo.

REM Preguntar si instalar dependencias
echo ¿Instalar/actualizar dependencias? (S/N)
set /p install="Respuesta: "

if /i "%install%"=="S" (
    echo.
    echo Instalando dependencias del cliente y servidor...
    call npm run install:all
    echo.
    echo [✓] Dependencias instaladas
    echo.
)

REM Verificar .env en servidor
if not exist "AllergySafety-Server\.env" (
    echo.
    echo [ADVERTENCIA] Archivo .env no encontrado en AllergySafety-Server
    echo Creando .env desde .env.example...
    copy "AllergySafety-Server\.env.example" "AllergySafety-Server\.env"
    echo [✓] .env creado. Asegúrate de configurarlo correctamente
    echo.
)

echo.
echo ========================================
echo    Iniciando aplicación...
echo ========================================
echo.
echo 🔵 Cliente en: http://localhost:5173
echo 🔴 Servidor en: http://localhost:5000
echo.
echo Presiona Ctrl+C en ambas ventanas para detener
echo.

REM Iniciar las aplicaciones de forma concurrente
npm run dev
