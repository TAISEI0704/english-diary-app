# クイックスタートガイド

English Diary App を **5分で起動**するためのガイドです。

## ⚡ 最速セットアップ（3ステップ）

### 1. クローン

```bash
cd ~
git clone <repository-url> english-diary-app
cd english-diary-app
```

### 2. 環境変数設定（自動）

```bash
# WSL2のUID/GIDを自動設定
cat >> .env << EOF
USER_ID=$(id -u)
GROUP_ID=$(id -g)
EOF
```

### 3. 起動

```bash
# すべて自動で起動（初回は5-10分かかります）
docker compose up -d --build
```

## ✅ 動作確認

### ターミナルで確認

```bash
# 1. コンテナが起動しているか確認
docker compose ps

# 2. API動作確認
curl http://localhost:8000/api/test
```

期待される出力：
```json
{"message":"API is working!","timestamp":"...","environment":"Docker + FrankenPHP + Laravel Octane"}
```

### ブラウザで確認

以下のURLをブラウザで開く：
- **React**: http://localhost:3000
- **Laravel**: http://localhost:8000/api/test

React画面にAPIレスポンスが表示されれば成功！

## 🎯 次のステップ

### ⚡ bin/compose スクリプトを使う（推奨）

長いコマンドを簡略化するスクリプトが用意されています：

```bash
# 基本操作
bin/compose help     # ヘルプ表示
bin/compose status   # 詳細な状態確認
bin/compose logs     # ログ表示

# Laravel
bin/compose route    # ルート一覧
bin/compose migrate  # マイグレーション
bin/compose artisan make:model DiaryEntry -m

# React
bin/compose npm install axios
bin/compose npm:build

# Database
bin/compose psql     # PostgreSQL CLI
bin/compose db:dump  # バックアップ
```

**詳細: [docs/COMPOSE-SCRIPT.md](docs/COMPOSE-SCRIPT.md)**

### データベース確認

```bash
# PostgreSQL に接続（従来の方法）
docker compose exec postgres psql -U diary_user -d english_diary

# または bin/compose を使用（推奨）
bin/compose psql

# テーブル一覧表示
\dt

# 終了
\q
```

### Laravel コマンドを試す

```bash
# ルート一覧（従来の方法）
docker compose exec frankenphp-laravel php artisan route:list

# bin/compose を使用（推奨）
bin/compose route

# 新しいマイグレーション作成
bin/compose artisan make:migration create_diary_entries_table
```

### React開発を始める

```bash
# パッケージ追加（従来の方法）
docker compose exec react-dev npm install <package-name>

# bin/compose を使用（推奨）
bin/compose npm install <package-name>

# ログ表示
bin/compose logs react-dev
```

## 🛑 停止と再起動

```bash
# 停止
docker compose down

# 再起動
docker compose up -d

# ログ確認
docker compose logs -f
```

## ⚠️ トラブルシューティング

### コンテナが起動しない

```bash
# 完全リセット
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### ポート競合エラー

他のサービスがポートを使用している場合：
- PostgreSQL: ポート5433を使用（デフォルトの5432ではない）
- 他のポート競合は `docker-compose.yml` で変更可能

### 権限エラー

```bash
# UID/GIDを確認
id

# .envのUSER_IDとGROUP_IDを上記の値に合わせる
# その後、再ビルド
docker compose build frankenphp-laravel
docker compose up -d
```

## 📚 詳細情報

完全なドキュメントは [README.md](README.md) を参照してください。

---

**これで開発環境の準備完了です！** 🎉
