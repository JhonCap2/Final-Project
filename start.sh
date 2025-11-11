#!/bin/bash

# AllergySafety - Script de inicio para macOS/Linux
# Este script inicia tanto el servidor como el cliente

echo ""
echo "========================================"
echo "   AllergySafety - Full Stack"
echo "========================================"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js no está instalado"
    echo "Descarga desde: https://nodejs.org/"
    exit 1
fi

echo "[✓] Node.js detectado: $(node --version)"
echo ""

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm no está instalado"
    exit 1
fi

echo "[✓] npm detectado: $(npm --version)"
echo ""

# Verificar si las carpetas existen
if [ ! -d "AllergySafety-Server" ]; then
    echo "[ERROR] Carpeta AllergySafety-Server no encontrada"
    exit 1
fi

if [ ! -d "AllergySafety-Client" ]; then
    echo "[ERROR] Carpeta AllergySafety-Client no encontrada"
    exit 1
fi

echo "[✓] Estructura de carpetas correcta"
echo ""

# Preguntar si instalar dependencias
read -p "¿Instalar/actualizar dependencias? (s/n): " install

if [[ "$install" =~ ^[Ss]$ ]]; then
    echo ""
    echo "Instalando dependencias globales..."
    npm install
    
    echo ""
    echo "Instalando dependencias del servidor..."
    cd AllergySafety-Server
    npm install
    cd ..
    
    echo ""
    echo "Instalando dependencias del cliente..."
    cd AllergySafety-Client
    npm install
    cd ..
    
    echo ""
    echo "[✓] Dependencias instaladas"
    echo ""
fi

# Verificar .env en servidor
if [ ! -f "AllergySafety-Server/.env" ]; then
    echo ""
    echo "[ADVERTENCIA] Archivo .env no encontrado en AllergySafety-Server"
    echo "Creando .env desde .env.example..."
    cp "AllergySafety-Server/.env.example" "AllergySafety-Server/.env"
    echo "[✓] .env creado. Asegúrate de configurarlo correctamente"
    echo ""
fi

echo ""
echo "========================================"
echo "   Iniciando aplicación..."
echo "========================================"
echo ""
echo "🔵 Cliente en: http://localhost:5173"
echo "🔴 Servidor en: http://localhost:5000"
echo ""
echo "Presiona Ctrl+C para detener"
echo ""

# Iniciar las aplicaciones
npm run dev
