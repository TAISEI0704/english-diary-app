FROM dunglas/frankenphp:php8.5

# WSL2環境対応: ビルド引数でUID/GIDを受け取る
ARG USER_ID=1000
ARG GROUP_ID=1000

# システム依存関係のインストール
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    git \
    unzip \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# PHP拡張のインストール
RUN install-php-extensions \
    pdo_pgsql \
    pgsql \
    pcntl \
    sockets \
    opcache

# Composerのインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Node.js 20のインストール（Octane --watch用）
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# WSL2環境対応: ホストと同じUID/GIDでユーザーを作成
RUN groupadd -g ${GROUP_ID} appuser || true && \
    useradd -u ${USER_ID} -g ${GROUP_ID} -m -s /bin/bash appuser || true && \
    echo "appuser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# ディレクトリ作成と権限設定
RUN mkdir -p /app && \
    chown -R ${USER_ID}:${GROUP_ID} /app

# Caddy用ストレージディレクトリ作成（admin endpoint用）
RUN mkdir -p /home/appuser/.local/share/caddy && \
    mkdir -p /home/appuser/.config/caddy && \
    chown -R ${USER_ID}:${GROUP_ID} /home/appuser/.local /home/appuser/.config

# 作業ディレクトリ設定
WORKDIR /app

# エントリーポイントスクリプト作成（権限問題の自動修正用）
RUN echo '#!/bin/bash\n\
# Laravel storage/cache ディレクトリの所有者と権限設定\n\
if [ -d "/app/storage" ]; then\n\
    sudo chown -R appuser:appuser /app/storage /app/bootstrap/cache 2>/dev/null || true\n\
    sudo chmod -R 775 /app/storage /app/bootstrap/cache 2>/dev/null || true\n\
fi\n\
\n\
# Laravel Octane + FrankenPHPで起動（admin endpoint有効）\n\
echo "Starting Laravel Octane with FrankenPHP..."\n\
exec php artisan octane:start --server=frankenphp --host=0.0.0.0 --port=8000 --admin-port=2019 --watch\n\
' > /entrypoint.sh && \
    chmod +x /entrypoint.sh && \
    chown ${USER_ID}:${GROUP_ID} /entrypoint.sh

# ユーザー切り替え（rootで実行しない）
USER appuser

# エントリーポイント設定
ENTRYPOINT ["/entrypoint.sh"]
