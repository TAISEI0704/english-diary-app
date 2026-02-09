FROM dunglas/frankenphp:1.10.1-php8.5-bookworm

ENV COMPOSER_ALLOW_SUPERUSER=1

ARG USER_ID
ARG GROUP_ID

RUN mkdir -p /data/caddy \
    && chown -R $WEB_USER_ID:$WEB_GROUP_ID /data

# PHP拡張のインストール
RUN install-php-extensions \
    pdo_pgsql \
    zip \
    pcntl \
    sockets \
    opcache

# Composerのインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Node.js 22のインストール（Octane --watch用）
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Caddy用ストレージディレクトリ作成（admin endpoint用）
RUN mkdir -p /home/appuser/.local/share/caddy && \
    mkdir -p /home/appuser/.config/caddy

# 作業ディレクトリ設定
WORKDIR /app

# エントリーポイントスクリプトコピー
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod 755 /usr/local/bin/docker-entrypoint.sh

# エントリーポイント設定
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

CMD ["php", "artisan", "octane:frankenphp", "--host=0.0.0.0", "--port=8000", "--admin-port=2019", "--watch"]
