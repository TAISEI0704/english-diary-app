# よく使うコマンド集

開発中に頻繁に使うコマンドのチートシート

## 📋 目次

- [Docker操作](#docker操作)
- [Laravel](#laravel)
- [React](#react)
- [データベース](#データベース)
- [Git](#git)
- [便利なエイリアス](#便利なエイリアス)

## 🐳 Docker操作

### 基本操作

```bash
# コンテナ起動
docker compose up -d

# コンテナ停止
docker compose down

# コンテナ再起動
docker compose restart

# ログ確認（リアルタイム）
docker compose logs -f

# 特定サービスのログ
docker compose logs -f frankenphp-laravel
docker compose logs -f react-dev
docker compose logs -f postgres

# コンテナ状態確認
docker compose ps

# コンテナ詳細確認
docker compose ps -a
```

### コンテナ内でコマンド実行

```bash
# Laravel コンテナ（Bash）
docker compose exec frankenphp-laravel bash

# React コンテナ（sh - Alpineは bashなし）
docker compose exec react-dev sh

# PostgreSQL コンテナ
docker compose exec postgres bash

# root ユーザーで実行
docker compose exec -u root frankenphp-laravel bash
```

### クリーンアップ

```bash
# コンテナ停止・削除
docker compose down

# ボリュームも削除（データベースがリセットされます！）
docker compose down -v

# イメージ再ビルド
docker compose build --no-cache

# すべて削除して再起動
docker compose down -v && docker compose build --no-cache && docker compose up -d

# 未使用リソース削除
docker system prune

# すべて削除（警告：未使用のイメージもすべて削除）
docker system prune -a --volumes
```

### デバッグ

```bash
# コンテナのリソース使用状況
docker stats

# 特定コンテナのプロセス確認
docker compose top frankenphp-laravel

# ネットワーク確認
docker network ls
docker network inspect english-diary-app_english-diary-network

# ボリューム確認
docker volume ls
docker volume inspect english-diary-app_postgres_data
```

## 🎯 Laravel

### Artisan コマンド

```bash
# 基本形式
docker compose exec frankenphp-laravel php artisan <command>

# よく使うコマンド
docker compose exec frankenphp-laravel php artisan route:list      # ルート一覧
docker compose exec frankenphp-laravel php artisan migrate         # マイグレーション実行
docker compose exec frankenphp-laravel php artisan migrate:fresh   # DB リセット
docker compose exec frankenphp-laravel php artisan migrate:rollback # 最後のマイグレーションを戻す
docker compose exec frankenphp-laravel php artisan db:seed         # シーダー実行
docker compose exec frankenphp-laravel php artisan tinker          # REPL起動
```

### ファイル生成

```bash
# モデル（マイグレーション付き）
docker compose exec frankenphp-laravel php artisan make:model DiaryEntry -m

# コントローラー（API用）
docker compose exec frankenphp-laravel php artisan make:controller Api/DiaryController --api

# マイグレーション
docker compose exec frankenphp-laravel php artisan make:migration create_diary_entries_table

# シーダー
docker compose exec frankenphp-laravel php artisan make:seeder DiaryEntrySeeder

# リクエストバリデーション
docker compose exec frankenphp-laravel php artisan make:request StoreDiaryEntryRequest

# APIリソース
docker compose exec frankenphp-laravel php artisan make:resource DiaryEntryResource

# テスト
docker compose exec frankenphp-laravel php artisan make:test DiaryEntryTest
```

### Composer

```bash
# パッケージインストール
docker compose exec frankenphp-laravel sudo composer install

# パッケージ追加
docker compose exec frankenphp-laravel sudo composer require laravel/sanctum

# パッケージ削除
docker compose exec frankenphp-laravel sudo composer remove package/name

# オートロード再生成
docker compose exec frankenphp-laravel sudo composer dump-autoload

# 依存関係更新
docker compose exec frankenphp-laravel sudo composer update
```

### キャッシュ管理

```bash
# すべてのキャッシュクリア
docker compose exec frankenphp-laravel php artisan optimize:clear

# 個別クリア
docker compose exec frankenphp-laravel php artisan cache:clear
docker compose exec frankenphp-laravel php artisan config:clear
docker compose exec frankenphp-laravel php artisan route:clear
docker compose exec frankenphp-laravel php artisan view:clear

# キャッシュ生成（本番環境用）
docker compose exec frankenphp-laravel php artisan config:cache
docker compose exec frankenphp-laravel php artisan route:cache
docker compose exec frankenphp-laravel php artisan view:cache
```

### テスト

```bash
# すべてのテスト実行
docker compose exec frankenphp-laravel php artisan test

# 特定のテスト
docker compose exec frankenphp-laravel php artisan test --filter DiaryEntryTest

# カバレッジ付き
docker compose exec frankenphp-laravel php artisan test --coverage
```

### その他

```bash
# アプリケーションキー生成
docker compose exec frankenphp-laravel php artisan key:generate

# ストレージリンク作成
docker compose exec frankenphp-laravel php artisan storage:link

# Pint（コードフォーマッター）
docker compose exec frankenphp-laravel ./vendor/bin/pint

# 環境情報表示
docker compose exec frankenphp-laravel php artisan about
```

## ⚛️ React

### npm コマンド

```bash
# パッケージインストール
docker compose exec react-dev npm install

# パッケージ追加
docker compose exec react-dev npm install axios
docker compose exec react-dev npm install -D eslint

# パッケージ削除
docker compose exec react-dev npm uninstall package-name

# パッケージ更新
docker compose exec react-dev npm update

# 脆弱性チェック
docker compose exec react-dev npm audit
docker compose exec react-dev npm audit fix
```

### ビルド・開発

```bash
# 開発サーバー起動（docker-compose.yml で自動起動）
docker compose exec react-dev npm run dev

# 本番ビルド
docker compose exec react-dev npm run build

# ビルド結果のプレビュー
docker compose exec react-dev npm run preview

# Lint
docker compose exec react-dev npm run lint

# Lint修正
docker compose exec react-dev npm run lint -- --fix
```

## 🗄️ データベース

### PostgreSQL CLI

```bash
# psql 起動
docker compose exec postgres psql -U diary_user -d english_diary

# SQL実行（ワンライナー）
docker compose exec postgres psql -U diary_user -d english_diary -c "SELECT * FROM users;"

# SQLファイル実行
docker compose exec -T postgres psql -U diary_user -d english_diary < query.sql
```

### psql 内部コマンド（psql起動後）

```sql
-- データベース一覧
\l

-- テーブル一覧
\dt

-- テーブル構造表示
\d table_name

-- 現在の接続情報
\conninfo

-- ヘルプ
\?

-- 終了
\q
```

### バックアップ・リストア

```bash
# データベースバックアップ
docker compose exec postgres pg_dump -U diary_user english_diary > backup_$(date +%Y%m%d).sql

# リストア
cat backup_20240124.sql | docker compose exec -T postgres psql -U diary_user -d english_diary

# 全データベースバックアップ
docker compose exec postgres pg_dumpall -U diary_user > backup_all_$(date +%Y%m%d).sql
```

### データベース操作

```bash
# データベース作成
docker compose exec postgres createdb -U diary_user new_database

# データベース削除
docker compose exec postgres dropdb -U diary_user database_name

# ユーザー一覧
docker compose exec postgres psql -U diary_user -d english_diary -c "\du"

# テーブルサイズ確認
docker compose exec postgres psql -U diary_user -d english_diary -c "
  SELECT
    table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) AS size
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;
"
```

## 📝 Git

### 基本操作

```bash
# 状態確認
git status

# 変更を追加
git add .
git add backend/app/Models/DiaryEntry.php

# コミット
git commit -m "Add diary entry model"

# プッシュ
git push origin main

# プル
git pull origin main

# ブランチ作成・切り替え
git checkout -b feature/diary-crud

# ブランチ一覧
git branch

# ブランチマージ
git checkout main
git merge feature/diary-crud
```

### ログ確認

```bash
# コミット履歴
git log

# 簡潔な履歴
git log --oneline --graph --all

# 特定ファイルの履歴
git log -- backend/routes/api.php

# 差分確認
git diff
git diff backend/routes/api.php
```

## 🚀 便利なエイリアス

`.bashrc` または `.zshrc` に追加すると便利：

```bash
# Docker Compose 短縮形
alias dc='docker compose'
alias dcup='docker compose up -d'
alias dcdown='docker compose down'
alias dclogs='docker compose logs -f'
alias dcps='docker compose ps'

# Laravel
alias artisan='docker compose exec frankenphp-laravel php artisan'
alias tinker='docker compose exec frankenphp-laravel php artisan tinker'
alias migrate='docker compose exec frankenphp-laravel php artisan migrate'
alias fresh='docker compose exec frankenphp-laravel php artisan migrate:fresh --seed'

# Composer
alias composer='docker compose exec frankenphp-laravel sudo composer'

# React
alias npm='docker compose exec react-dev npm'

# PostgreSQL
alias psql='docker compose exec postgres psql -U diary_user -d english_diary'

# ログイン
alias backend='docker compose exec frankenphp-laravel bash'
alias frontend='docker compose exec react-dev sh'
alias db='docker compose exec postgres bash'
```

### エイリアス適用方法

```bash
# .bashrc に追記
cat >> ~/.bashrc << 'EOF'

# English Diary App Aliases
alias dc='docker compose'
alias dcup='docker compose up -d'
alias artisan='docker compose exec frankenphp-laravel php artisan'
alias composer='docker compose exec frankenphp-laravel sudo composer'
alias npm='docker compose exec react-dev npm'

EOF

# 再読み込み
source ~/.bashrc

# 使用例
dcup           # docker compose up -d
artisan route:list
composer require package/name
npm install axios
```

## 📊 システム監視

```bash
# リアルタイムログ監視
docker compose logs -f | grep ERROR

# コンテナリソース使用状況
watch -n 1 docker stats

# ディスク使用量
docker system df
du -sh backend/vendor
du -sh frontend/node_modules

# ポート使用確認
sudo lsof -i :8000
sudo lsof -i :3000
sudo lsof -i :5433
```

## 🔧 トラブルシューティング

```bash
# 権限修正（Laravel storage）
docker compose exec -u root frankenphp-laravel chown -R appuser:appuser /app/storage /app/bootstrap/cache
docker compose exec -u root frankenphp-laravel chmod -R 775 /app/storage /app/bootstrap/cache

# コンテナ完全リセット
docker compose down -v && docker compose build --no-cache && docker compose up -d

# 特定のサービスのみ再ビルド
docker compose build --no-cache frankenphp-laravel
docker compose up -d frankenphp-laravel

# ログファイル削除
docker compose exec frankenphp-laravel sh -c "truncate -s 0 storage/logs/*.log"
```

## 💡 ワンライナー集

```bash
# Laravel: すべてのルートをJSON形式で出力
docker compose exec frankenphp-laravel php artisan route:list --json

# データベース: すべてのテーブルの行数を表示
docker compose exec postgres psql -U diary_user -d english_diary -c "
  SELECT schemaname,relname,n_live_tup
  FROM pg_stat_user_tables
  ORDER BY n_live_tup DESC;
"

# API テスト: すべてのエンドポイントをテスト
curl http://localhost:8000/api/test && echo "" && \
curl http://localhost:8000/up && echo ""

# パッケージバージョン確認
echo "PHP: $(docker compose exec frankenphp-laravel php -v | head -1)" && \
echo "Composer: $(docker compose exec frankenphp-laravel composer -V)" && \
echo "Node: $(docker compose exec react-dev node -v)" && \
echo "npm: $(docker compose exec react-dev npm -v)"

# すべてのコンテナを再起動（ログ監視付き）
docker compose restart && docker compose logs -f
```

---

このコマンド集を印刷またはブックマークして、手元に置いておくと便利です！
