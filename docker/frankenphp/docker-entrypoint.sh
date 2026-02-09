#!/usr/bin/env sh
set -e

echo "=========================================="
echo "L-Gate Data Platform Backend"
echo "Starting Laravel Octane with FrankenPHP"
echo "=========================================="
echo ""

# ========== 1. Composer Install ==========
echo "[1/3] Installing PHP dependencies..."
composer install --no-interaction --no-scripts

if [ $? -ne 0 ]; then
    echo "[ERROR] Composer install failed!"
    exit 1
fi
echo "[OK] PHP dependencies installed"
echo ""

# ========== 1.5. Run Post-Install Scripts ==========
echo "[1.5/3] Running post-install scripts..."
composer run-script post-autoload-dump --no-interaction 2>&1 || echo "[WARNING] Post-autoload-dump script failed (non-critical)"
echo ""

# ========== 2. Generate APP_KEY ==========
echo "[2/3] Checking APP_KEY..."
if [ -z "$APP_KEY" ]; then
    echo "APP_KEY not set. Generating..."
    php artisan key:generate
    if [ $? -ne 0 ]; then
        echo "[ERROR] Key generation failed!"
        exit 1
    fi
    echo "[OK] APP_KEY generated"
else
    echo "[OK] APP_KEY already set"
fi

# Clear config cache to ensure new APP_KEY is loaded
php artisan config:clear
echo ""

# ========== 3. Start Laravel Octane ==========
echo "[3/3] Starting Laravel Octane..."
echo "=========================================="
echo ""

exec "$@"
