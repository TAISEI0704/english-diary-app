# English Diary App

Laravel + React + Docker で構築された英語日記アプリケーションの開発環境

## 📋 目次

- [技術スタック](#技術スタック)
- [前提条件](#前提条件)
- [セットアップ手順](#セットアップ手順)
- [使用方法](#使用方法)
- [よくある問題](#よくある問題)
- [プロジェクト構成](#プロジェクト構成)
- [開発コマンド](#開発コマンド)

## 🚀 技術スタック

### バックエンド
- **Laravel** 12.48.1 - REST API
- **PHP** 8.5.2
- **FrankenPHP** - モダンPHPアプリケーションサーバー
- **Laravel Sanctum** - API認証
- **PostgreSQL** 18.1 - データベース

### フロントエンド
- **React** 19.0
- **Vite** 7.3.1 - ビルドツール
- **Axios** - HTTP クライアント
- **React Router DOM** - ルーティング

### インフラ
- **Docker** & **Docker Compose** - コンテナ化
- **WSL2** 最適化済み

## 📦 前提条件

以下のソフトウェアがインストールされている必要があります：

- **Docker Desktop for Windows** (WSL2統合が有効)
- **WSL2** (Ubuntu 20.04 以降推奨)
- **Git** (WSL2内)

### WSL2の確認

```bash
# WSL2のバージョン確認
wsl --list --verbose

# WSL2内で実行していることを確認
pwd  # /home/... で始まること（/mnt/c/... はNG）
```

## 🛠 セットアップ手順

### 1. リポジトリのクローン

```bash
# WSL2のホームディレクトリに移動
cd ~

# プロジェクトをクローン
git clone <repository-url> english-diary-app
cd english-diary-app
```

**重要**: `/mnt/c/` 配下ではなく、WSL2ネイティブファイルシステム (`/home/`) 配下にクローンしてください。パフォーマンスと権限の問題を回避できます。

### 2. 環境変数の設定

`.env` ファイルがプロジェクトルートに既に存在しますが、必要に応じて編集してください：

```bash
# UID/GIDを自動設定（WSL2環境の権限問題を回避）
echo "USER_ID=$(id -u)" >> .env
echo "GROUP_ID=$(id -g)" >> .env
```

デフォルト設定：
```env
DB_DATABASE=english_diary
DB_USERNAME=diary_user
DB_PASSWORD=secure_password_change_in_production
USER_ID=1000
GROUP_ID=1001
```

### 3. Dockerコンテナのビルドと起動

```bash
# すべてのコンテナをビルド・起動
docker compose up -d --build
```

初回起動時は以下の処理が自動実行されます：
- PostgreSQL データベース作成
- FrankenPHP イメージビルド
- React 依存パッケージインストール
- Laravel ストレージ権限設定

**注意**: ビルドには5-10分程度かかる場合があります。

### 4. コンテナの起動確認

```bash
# すべてのコンテナが起動していることを確認
docker compose ps
```

以下の3つのコンテナが `Up` 状態であることを確認：
- `english-diary-postgres`
- `english-diary-frankenphp`
- `english-diary-react`

### 5. データベースマイグレーション（初回のみ）

マイグレーションは Laravel プロジェクト作成時に自動実行されていますが、必要に応じて再実行できます：

```bash
docker compose exec web php artisan migrate
```

### 6. 動作確認

#### バックエンド API
```bash
curl http://localhost:8000/api/test
```

期待される出力：
```json
{"message":"API is working!","timestamp":"2026-01-24T...","environment":"Docker + FrankenPHP + Laravel Octane"}
```

#### フロントエンド
ブラウザで以下にアクセス：
```
http://localhost:3000
```

APIステータスとレスポンスが表示されれば成功です。

## 🎮 使用方法

### アプリケーションへのアクセス

| サービス | URL | 説明 |
|---------|-----|------|
| React Frontend | http://localhost:3000 | SPA フロントエンド |
| Laravel API | http://localhost:8000/api | REST API エンドポイント |
| FrankenPHP Admin | http://localhost:2019 | Caddy 管理画面 |
| PostgreSQL | localhost:5433 | データベース (ポート5433に注意) |

### コンテナの起動/停止

```bash
# 起動
docker compose up -d

# 停止
docker compose down

# ログ確認
docker compose logs -f

# 特定のサービスのログ
docker compose logs -f web
docker compose logs -f react-dev
```

### ⚡ bin/compose スクリプト（推奨）

長い Docker Compose コマンドを簡略化するスクリプトを用意しています：

```bash
# 基本的な使い方
bin/compose help           # ヘルプを表示
bin/compose up             # コンテナ起動
bin/compose ps             # 状態確認
bin/compose logs           # ログ表示

# Laravel操作
bin/compose migrate        # マイグレーション実行
bin/compose artisan route:list  # ルート一覧
bin/compose test           # テスト実行

# React操作
bin/compose npm install axios  # パッケージ追加
bin/compose npm:build      # 本番ビルド

# データベース操作
bin/compose psql           # PostgreSQL CLI
bin/compose db:dump        # バックアップ作成

# ユーティリティ
bin/compose status         # 詳細な状態確認
bin/compose clean          # キャッシュクリア
bin/compose fix:permissions # 権限修正
```

**詳細は [docs/COMPOSE-SCRIPT.md](docs/COMPOSE-SCRIPT.md) を参照してください。**

## ❗ よくある問題

### ポート5432が既に使用されている

別のPostgreSQLコンテナが5432を使用している場合、このプロジェクトは **5433** を使用します。

### 権限エラー (Permission denied)

WSL2環境での権限問題の解決方法：

```bash
# .env のUID/GIDを確認
cat .env | grep USER_ID
cat .env | grep GROUP_ID

# 自分のUID/GIDを確認
id -u  # 通常は 1000
id -g  # 通常は 1000 または 1001

# 一致しない場合は修正
sed -i "s/USER_ID=.*/USER_ID=$(id -u)/" .env
sed -i "s/GROUP_ID=.*/GROUP_ID=$(id -g)/" .env

# コンテナを再ビルド
docker compose down
docker compose build --no-cache frankenphp-laravel
docker compose up -d
```

### React のホットリロードが動作しない

`vite.config.js` で `usePolling: true` が設定されていることを確認：

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true  // Docker環境で必須
    }
  }
})
```

### Laravel ストレージ権限エラー

```bash
# コンテナ内で権限を修正
docker compose exec -u root frankenphp-laravel chown -R appuser:appuser /app/storage /app/bootstrap/cache
docker compose exec -u root frankenphp-laravel chmod -R 775 /app/storage /app/bootstrap/cache

# コンテナ再起動
docker compose restart frankenphp-laravel
```

### コンテナが起動しない

```bash
# すべてのコンテナを停止・削除
docker compose down

# ボリュームも削除（データベースがリセットされます！）
docker compose down -v

# イメージをクリーンビルド
docker compose build --no-cache

# 再起動
docker compose up -d
```

## 📁 プロジェクト構成

```
english-diary-app/
├── backend/              # Laravel バックエンド
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   │   └── migrations/  # データベーススキーマ
│   ├── routes/
│   │   ├── api.php      # API ルート
│   │   └── web.php
│   ├── storage/
│   └── .env             # Laravel 環境変数
├── frontend/             # React フロントエンド
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js   # Axios API クライアント
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js   # Vite設定
│   └── .env             # React 環境変数
├── docker/               # Docker設定
│   └── frankenphp/
│       └── Dockerfile   # FrankenPHP イメージ
├── docker-compose.yml    # Docker Compose設定
├── .env                  # プロジェクト環境変数
├── .gitignore
└── README.md
```

## 🔧 開発コマンド

### Laravel (バックエンド)

```bash
# Artisan コマンド
docker compose exec frankenphp-laravel php artisan <command>

# マイグレーション
docker compose exec frankenphp-laravel php artisan migrate

# マイグレーションのロールバック
docker compose exec frankenphp-laravel php artisan migrate:rollback

# モデル作成 (マイグレーション付き)
docker compose exec frankenphp-laravel php artisan make:model DiaryEntry -m

# コントローラー作成 (API用)
docker compose exec frankenphp-laravel php artisan make:controller Api/DiaryController --api

# ルート一覧
docker compose exec frankenphp-laravel php artisan route:list

# Composer パッケージ追加
docker compose exec frankenphp-laravel sudo composer require <package>

# キャッシュクリア
docker compose exec frankenphp-laravel php artisan cache:clear
docker compose exec frankenphp-laravel php artisan config:clear
```

### React (フロントエンド)

```bash
# npm パッケージ追加
docker compose exec react-dev npm install <package>

# 開発サーバー再起動
docker compose restart react-dev

# ビルド（本番用）
docker compose exec react-dev npm run build

# ESLint
docker compose exec react-dev npm run lint
```

### PostgreSQL (データベース)

```bash
# PostgreSQL CLI アクセス
docker compose exec postgres psql -U diary_user -d english_diary

# SQL実行
docker compose exec postgres psql -U diary_user -d english_diary -c "SELECT * FROM users;"

# データベースバックアップ
docker compose exec postgres pg_dump -U diary_user english_diary > backup.sql

# データベースリストア
cat backup.sql | docker compose exec -T postgres psql -U diary_user -d english_diary
```

### Docker 管理

```bash
# すべてのコンテナ再起動
docker compose restart

# 特定のコンテナ再起動
docker compose restart frankenphp-laravel

# コンテナ内でシェル起動
docker compose exec frankenphp-laravel bash
docker compose exec react-dev sh

# ディスク使用量確認
docker system df

# 未使用リソース削除
docker system prune -a
```

## 🔐 セキュリティ注意事項

**本番環境にデプロイする前に必ず以下を変更してください:**

1. `.env` の `DB_PASSWORD` を強力なパスワードに変更
2. Laravel の `APP_KEY` を再生成: `php artisan key:generate`
3. `APP_DEBUG=false` に設定
4. CORS設定を本番ドメインに制限
5. HTTPS を有効化

## 📝 ライセンス

このプロジェクトは開発環境のセットアップ例です。

## 🤝 コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📞 サポート

問題が発生した場合は、以下を確認してください：
1. Docker Desktop が起動している
2. WSL2統合が有効になっている
3. プロジェクトが `/home/` 配下にある
4. `.env` ファイルが正しく設定されている

それでも解決しない場合は、issue を作成してください。
