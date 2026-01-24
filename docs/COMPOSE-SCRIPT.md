# bin/compose スクリプトガイド

Docker Compose コマンドを簡略化する便利なラッパースクリプト

## 📋 目次

- [概要](#概要)
- [基本的な使い方](#基本的な使い方)
- [コマンド一覧](#コマンド一覧)
- [実用例](#実用例)
- [従来のコマンドとの比較](#従来のコマンドとの比較)

## 🎯 概要

`bin/compose` スクリプトは、長い Docker Compose コマンドを短縮し、開発ワークフローを効率化します。

### メリット

✅ **タイピングが楽** - `docker compose exec frankenphp-laravel php artisan migrate` → `bin/compose migrate`
✅ **覚えやすい** - 直感的なコマンド名
✅ **エラーが少ない** - コンテナ名やパスを覚える必要なし
✅ **安全** - `destroy` コマンドは確認プロンプト付き

## 🚀 基本的な使い方

```bash
# 基本構文
bin/compose <command> [options]

# ヘルプを表示
bin/compose help

# コンテナを起動
bin/compose up

# コンテナの状態を確認
bin/compose ps
```

## 📖 コマンド一覧

### 🐳 Docker 基本操作

| コマンド | 説明 | 従来のコマンド |
|---------|------|---------------|
| `up` | すべてのコンテナを起動 | `docker compose up -d --wait` |
| `stop` | すべてのコンテナを停止 | `docker compose stop` |
| `down` | コンテナを停止・削除 | `docker compose down` |
| `restart` | コンテナを再起動 | `docker compose restart` |
| `build` | イメージを再ビルド | `docker compose build --no-cache` |
| `rebuild` | 完全な再ビルド（down + build + up） | 複数コマンド |
| `destroy` | すべて削除（⚠️ 確認付き） | `docker compose down --rmi all --volumes` |
| `ps` | コンテナ状態を表示 | `docker compose ps` |
| `logs` | ログを表示（リアルタイム） | `docker compose logs -f` |
| `exec` | コンテナ内でコマンド実行 | `docker compose exec` |

### 🎯 Laravel 操作

| コマンド | 説明 | 従来のコマンド |
|---------|------|---------------|
| `artisan` | Artisan コマンド実行 | `docker compose exec frankenphp-laravel php artisan` |
| `tinker` | Tinker REPL を起動 | `docker compose exec frankenphp-laravel php artisan tinker` |
| `migrate` | マイグレーション実行 | `docker compose exec frankenphp-laravel php artisan migrate` |
| `fresh` | DB リセット＋シーディング | `docker compose exec frankenphp-laravel php artisan migrate:fresh --seed` |
| `rollback` | 最後のマイグレーションを戻す | `docker compose exec frankenphp-laravel php artisan migrate:rollback` |
| `seed` | シーダー実行 | `docker compose exec frankenphp-laravel php artisan db:seed` |
| `route` | ルート一覧を表示 | `docker compose exec frankenphp-laravel php artisan route:list` |
| `test` | テスト実行 | `docker compose exec frankenphp-laravel php artisan test` |
| `pint` | コードフォーマット | `docker compose exec frankenphp-laravel ./vendor/bin/pint` |

### 📦 Composer 操作

| コマンド | 説明 | 従来のコマンド |
|---------|------|---------------|
| `composer` | Composer コマンド実行 | `docker compose exec frankenphp-laravel sudo composer` |
| `install` | 依存パッケージインストール | `docker compose exec frankenphp-laravel sudo composer install` |
| `require` | パッケージ追加 | `docker compose exec frankenphp-laravel sudo composer require` |
| `update` | パッケージ更新 | `docker compose exec frankenphp-laravel sudo composer update` |

### ⚛️ React/npm 操作

| コマンド | 説明 | 従来のコマンド |
|---------|------|---------------|
| `npm` | npm コマンド実行 | `docker compose exec react-dev npm` |
| `npm:install` | npm パッケージインストール | `docker compose exec react-dev npm install` |
| `npm:dev` | 開発サーバー起動 | `docker compose exec react-dev npm run dev` |
| `npm:build` | 本番ビルド | `docker compose exec react-dev npm run build` |
| `npm:lint` | Lint 実行 | `docker compose exec react-dev npm run lint` |

### 🗄️ Database 操作

| コマンド | 説明 | 従来のコマンド |
|---------|------|---------------|
| `psql` | PostgreSQL CLI | `docker compose exec postgres psql -U diary_user -d english_diary` |
| `db:dump` | データベースバックアップ | `docker compose exec postgres pg_dump ...` |
| `db:restore` | バックアップから復元 | `cat backup.sql \| docker compose exec -T postgres psql ...` |

### 💻 シェルアクセス

| コマンド | 説明 | 従来のコマンド |
|---------|------|---------------|
| `shell:backend` | Laravel コンテナにログイン | `docker compose exec frankenphp-laravel bash` |
| `shell:frontend` | React コンテナにログイン | `docker compose exec react-dev sh` |
| `shell:db` | PostgreSQL コンテナにログイン | `docker compose exec postgres bash` |

### 🛠️ ユーティリティ

| コマンド | 説明 |
|---------|------|
| `status` | コンテナ状態とリソース使用量を表示 |
| `clean` | Laravel の全キャッシュをクリア |
| `fix:permissions` | ファイル権限を修正（WSL2用） |
| `help` | ヘルプを表示 |

## 💡 実用例

### 日常的な開発フロー

```bash
# 1. 朝: コンテナ起動
bin/compose up

# 2. 状態確認
bin/compose status

# 3. ログ監視（別ターミナル）
bin/compose logs

# 4. 新しいモデル作成
bin/compose artisan make:model DiaryEntry -m

# 5. マイグレーション実行
bin/compose migrate

# 6. ルート確認
bin/compose route

# 7. 夜: コンテナ停止
bin/compose stop
```

### 機能開発の例

```bash
# 日記エントリCRUD機能を実装

# 1. モデルとマイグレーション作成
bin/compose artisan make:model DiaryEntry -m

# 2. コントローラー作成
bin/compose artisan make:controller Api/DiaryEntryController --api

# 3. マイグレーション実行
bin/compose migrate

# 4. ルート確認
bin/compose route

# 5. React に axios をインストール
bin/compose npm install axios

# 6. テスト実行
bin/compose test

# 7. コードフォーマット
bin/compose pint
```

### トラブルシューティング

```bash
# キャッシュをクリア
bin/compose clean

# 権限エラーを修正
bin/compose fix:permissions

# コンテナを完全に再ビルド
bin/compose rebuild

# データベースをリセット
bin/compose fresh

# すべてログを確認
bin/compose logs

# 特定のコンテナのログのみ
bin/compose logs frankenphp-laravel
```

### データベース管理

```bash
# データベースにアクセス
bin/compose psql

# SQL実行
bin/compose psql -c "SELECT * FROM users;"

# バックアップ作成
bin/compose db:dump
# → backup_20240124_150000.sql が作成される

# バックアップから復元
bin/compose db:restore backup_20240124_150000.sql

# テーブル一覧
bin/compose psql -c "\dt"
```

### パッケージ管理

```bash
# Composer パッケージ追加
bin/compose require laravel/sanctum

# npm パッケージ追加
bin/compose npm install react-query

# 依存関係を更新
bin/compose composer update
bin/compose npm update
```

## 🔄 従来のコマンドとの比較

### Before（従来）

```bash
# 長くて覚えにくい
docker compose exec frankenphp-laravel php artisan migrate
docker compose exec frankenphp-laravel php artisan make:model DiaryEntry -m
docker compose exec react-dev npm install axios
docker compose exec postgres psql -U diary_user -d english_diary

# タイプミスしやすい
docker compose exec frankenphp-laravel php artisan tset  # ❌ typo
docker compose exec frankphp-laravel php artisan test    # ❌ typo
```

### After（bin/compose使用）

```bash
# 短くて直感的
bin/compose migrate
bin/compose artisan make:model DiaryEntry -m
bin/compose npm install axios
bin/compose psql

# タブ補完が効きやすい
bin/compose test  # ✅ シンプル
```

### 時間の節約

| タスク | 従来 | bin/compose | 節約 |
|-------|------|-------------|------|
| マイグレーション実行 | 63文字 | 20文字 | **68%削減** |
| Artisanコマンド | 55文字 | 16文字 | **71%削減** |
| npmコマンド | 38文字 | 12文字 | **68%削減** |
| psqlアクセス | 66文字 | 16文字 | **76%削減** |

## 🎓 便利なTips

### エイリアスを設定する

`.bashrc` または `.zshrc` に追加:

```bash
alias c='bin/compose'

# 使用例
c up
c migrate
c route
c npm install axios
```

### チェーンコマンド

```bash
# マイグレーション → ルート確認 → テスト
bin/compose migrate && bin/compose route && bin/compose test

# ビルド → 起動 → ログ確認
bin/compose build && bin/compose up && bin/compose logs
```

### プロジェクトルート以外から実行

```bash
# プロジェクトのどのディレクトリからでも実行可能
cd frontend/src/components
../../../bin/compose artisan route:list

# またはシンボリックリンクを作成
sudo ln -s /home/taisei/english-diary-app/bin/compose /usr/local/bin/compose
compose migrate  # どこからでも実行可能
```

### よく使うコマンドをスクリプト化

**scripts/dev.sh:**
```bash
#!/bin/bash
bin/compose up
bin/compose logs
```

**scripts/reset-db.sh:**
```bash
#!/bin/bash
bin/compose fresh
bin/compose seed
echo "✅ Database reset complete!"
```

## 🚨 注意事項

### destroy コマンド

`bin/compose destroy` は確認プロンプトが表示されますが、実行すると：

- すべてのコンテナが削除されます
- すべてのイメージが削除されます
- **すべてのボリューム（データベース含む）が削除されます**

本当に必要な時だけ使用してください。

### カスタムコマンドの追加

`bin/compose` ファイルを編集して、独自のコマンドを追加できます：

```bash
"custom-command" )
    echo "Running custom command..."
    # your custom logic here
    ;;
```

## 📚 関連ドキュメント

- [README.md](../README.md) - プロジェクト概要
- [COMMANDS.md](COMMANDS.md) - 全コマンドリファレンス
- [DEVELOPMENT.md](DEVELOPMENT.md) - 開発ワークフロー

---

**bin/compose スクリプトで開発効率アップ！** 🚀
