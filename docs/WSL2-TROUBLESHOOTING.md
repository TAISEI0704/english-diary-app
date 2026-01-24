# WSL2 トラブルシューティングガイド

WSL2環境でのDocker開発における一般的な問題と解決方法

## 📋 目次

- [権限関連の問題](#権限関連の問題)
- [パフォーマンスの問題](#パフォーマンスの問題)
- [ネットワークの問題](#ネットワークの問題)
- [Docker Desktop の問題](#docker-desktop-の問題)
- [ファイルシステムの問題](#ファイルシステムの問題)

## 🔐 権限関連の問題

### 問題: Permission denied エラー

#### 症状
```
Error: EACCES: permission denied, mkdir '/app/node_modules'
chmod: changing permissions of '/app/storage': Operation not permitted
```

#### 原因
ホスト（WSL2）とコンテナ間でUID/GIDが一致していない

#### 解決方法1: UID/GID の確認と修正

```bash
# 1. 自分のUID/GIDを確認
id -u  # 出力例: 1000
id -g  # 出力例: 1001

# 2. .env ファイルの値を確認
cat .env | grep USER_ID
cat .env | grep GROUP_ID

# 3. 一致しない場合は修正
sed -i "s/USER_ID=.*/USER_ID=$(id -u)/" .env
sed -i "s/GROUP_ID=.*/GROUP_ID=$(id -g)/" .env

# 4. コンテナを再ビルド
docker compose down
docker compose build --no-cache
docker compose up -d
```

#### 解決方法2: 所有者の変更（一時的な対処）

```bash
# ホストから所有者変更
# backend/storage などの権限エラーの場合
ls -la backend/storage  # 現在の所有者確認

# root所有の場合は変更
sudo chown -R $(id -u):$(id -g) backend/storage
sudo chown -R $(id -u):$(id -g) backend/bootstrap/cache
```

#### 解決方法3: コンテナ内から修正

```bash
# FrankenPHPコンテナ内で修正
docker compose exec -u root frankenphp-laravel chown -R appuser:appuser /app/storage /app/bootstrap/cache
docker compose exec -u root frankenphp-laravel chmod -R 775 /app/storage /app/bootstrap/cache

# コンテナ再起動
docker compose restart frankenphp-laravel
```

### 問題: Laravel storage への書き込みエラー

#### 症状
```
UnexpectedValueException: The stream or file "/app/storage/logs/laravel.log" could not be opened
```

#### 解決方法

```bash
# Dockerfile のエントリーポイントで自動修正されるはずだが、手動修正する場合:
docker compose exec -u root frankenphp-laravel sh -c "
  chown -R appuser:appuser /app/storage /app/bootstrap/cache
  chmod -R 775 /app/storage /app/bootstrap/cache
"

# コンテナ再起動
docker compose restart frankenphp-laravel
```

## ⚡ パフォーマンスの問題

### 問題: Docker が非常に遅い

#### 症状
- ファイル読み込みが遅い
- npm install/composer install が異常に遅い
- ホットリロードが効かない

#### 原因
プロジェクトが Windowsファイルシステム (`/mnt/c/`) 上にある

#### 解決方法: WSL2 ネイティブファイルシステムに移動

```bash
# 1. 現在の場所を確認
pwd
# ❌ /mnt/c/Users/... の場合は遅い
# ✅ /home/... の場合は正常

# 2. WSL2内に移動
cd ~
git clone <repository-url> english-diary-app
cd english-diary-app

# 3. 元のプロジェクトは削除またはバックアップ
```

**パフォーマンス比較:**
- `/mnt/c/` 配下: npm install に 5-10分
- `/home/` 配下: npm install に 30秒-1分

### 問題: Vite のホットリロードが遅い

#### 解決方法

**frontend/vite.config.js** を確認:
```javascript
export default defineConfig({
  server: {
    watch: {
      usePolling: true,  // 必須
      interval: 1000,    // ポーリング間隔（ミリ秒）
      ignored: ['**/node_modules/**', '**/vendor/**']  // 監視除外
    }
  }
})
```

## 🌐 ネットワークの問題

### 問題: ポート競合エラー

#### 症状
```
Error: bind: address already in use
Bind for 0.0.0.0:5432 failed: port is already allocated
```

#### 解決方法1: 使用中のポートを確認

```bash
# どのプロセスがポートを使用しているか確認
sudo lsof -i :5432
sudo lsof -i :8000
sudo lsof -i :3000

# Docker コンテナで使用中か確認
docker ps
```

#### 解決方法2: docker-compose.yml のポート変更

```yaml
services:
  postgres:
    ports:
      - "5433:5432"  # ホスト側を5433に変更

  frankenphp-laravel:
    ports:
      - "8001:8000"  # ホスト側を8001に変更

  react-dev:
    ports:
      - "3001:3000"  # ホスト側を3001に変更
```

**注意**: ポート変更後は以下も更新:
- `frontend/.env` の `VITE_API_URL`
- curlコマンドのURL

### 問題: コンテナ間通信ができない

#### 症状
React から Laravel API に接続できない

#### 解決方法

```bash
# 1. ネットワーク確認
docker network ls
docker network inspect english-diary-app_english-diary-network

# 2. すべてのコンテナが同じネットワークにいるか確認
docker compose ps

# 3. コンテナ内から疎通確認
docker compose exec react-dev ping frankenphp-laravel
docker compose exec react-dev wget -O- http://frankenphp-laravel:8000/api/test
```

## 🐳 Docker Desktop の問題

### 問題: Docker Desktop が起動しない

#### 解決方法1: WSL2 統合の確認

```bash
# Docker Desktop の設定を開く
# Settings → Resources → WSL Integration
# 使用しているディストリビューション（Ubuntu等）を有効化
```

#### 解決方法2: WSL2 の再起動

```bash
# Windows PowerShell で実行（管理者権限）
wsl --shutdown

# 数秒待ってから WSL2 を再起動
wsl

# Docker Desktop も再起動
```

### 問題: Docker コマンドが見つからない

#### 症状
```
bash: docker: command not found
bash: docker-compose: command not found
```

#### 解決方法

```bash
# Docker Desktop が起動しているか確認
# タスクバーの Docker アイコンを確認

# WSL2 統合が有効か確認
# Docker Desktop → Settings → Resources → WSL Integration

# PATH の確認
echo $PATH | grep docker

# シェルの再起動
exec bash
```

### 問題: Docker Compose V2 と V1 の違い

#### 症状
```
docker-compose: command not found
```

#### 解決方法

Docker Compose V2 では `docker compose`（ハイフンなし）を使用:

```bash
# ❌ 古い（V1）
docker-compose up -d

# ✅ 新しい（V2）
docker compose up -d

# エイリアス設定（任意）
echo "alias docker-compose='docker compose'" >> ~/.bashrc
source ~/.bashrc
```

## 📁 ファイルシステムの問題

### 問題: ファイルの変更が反映されない

#### 症状
- コードを変更してもコンテナに反映されない
- ホットリロードが動かない

#### 解決方法1: ボリュームマウントの確認

```bash
# docker-compose.yml のボリューム設定確認
cat docker-compose.yml | grep -A 2 volumes

# コンテナ内でファイルが見えるか確認
docker compose exec frankenphp-laravel ls -la
docker compose exec react-dev ls -la
```

#### 解決方法2: コンテナの再起動

```bash
# 特定のサービスを再起動
docker compose restart frankenphp-laravel

# すべて再起動
docker compose down
docker compose up -d
```

### 問題: node_modules や vendor が巨大

#### 症状
- ディスク容量を大量に消費
- node_modules が数GB

#### 解決方法: Named Volume の使用

**docker-compose.yml** で既に設定済み:
```yaml
services:
  react-dev:
    volumes:
      - ./frontend:/app
      - react_node_modules:/app/node_modules  # ホストにコピーしない

volumes:
  react_node_modules:  # Docker管理のボリューム
```

### 問題: .gitignore が効かない

#### 症状
vendor/ や node_modules/ がGitに追加されてしまう

#### 解決方法

```bash
# すでに追加されているファイルを削除
git rm -r --cached backend/vendor
git rm -r --cached frontend/node_modules

# .gitignore を確認
cat .gitignore

# コミット
git commit -m "Remove ignored files from tracking"
```

## 🔄 完全リセット手順

すべてが壊れた場合の最終手段:

```bash
# 1. すべてのコンテナを停止・削除
docker compose down -v

# 2. Dockerのクリーンアップ
docker system prune -a --volumes
# ⚠️ 警告: すべての未使用リソースが削除されます

# 3. プロジェクトのクリーン
rm -rf backend/vendor
rm -rf frontend/node_modules
rm -rf backend/storage/logs/*

# 4. 再ビルド
docker compose build --no-cache
docker compose up -d

# 5. 依存関係の再インストール（必要に応じて）
docker compose exec frankenphp-laravel sudo composer install
docker compose exec react-dev npm install

# 6. マイグレーション
docker compose exec frankenphp-laravel php artisan migrate:fresh
```

## 🛠 予防策

### 1. 正しい場所でプロジェクトを実行

```bash
# ✅ 推奨
/home/username/projects/english-diary-app

# ❌ 非推奨
/mnt/c/Users/username/projects/english-diary-app
```

### 2. .env ファイルの正しい設定

```bash
# UID/GID を正しく設定
echo "USER_ID=$(id -u)" >> .env
echo "GROUP_ID=$(id -g)" >> .env
```

### 3. 定期的なクリーンアップ

```bash
# 週に1回程度実行
docker system prune

# ログファイルのクリーンアップ
docker compose exec frankenphp-laravel sh -c "truncate -s 0 storage/logs/*.log"
```

### 4. Git でのバージョン管理

```bash
# .gitignore が正しく設定されているか確認
git status

# 必要なファイルのみコミット
git add .
git commit -m "descriptive message"
```

## 📚 参考リンク

- [Docker Desktop WSL2 Backend](https://docs.docker.com/desktop/wsl/)
- [WSL2 Best Practices](https://docs.microsoft.com/en-us/windows/wsl/compare-versions)
- [Docker Compose File Reference](https://docs.docker.com/compose/compose-file/)

## 💡 追加のヒント

### VSCode の設定（推奨）

```bash
# WSL2 内で VSCode を開く
code .

# 拡張機能:
# - Remote - WSL
# - Docker
# - PHP Intelephense（Laravel用）
# - ES7+ React/Redux/React-Native snippets
```

### メモリ使用量の制限

WSL2 のメモリ使用量を制限する場合:

**C:\Users\<username>\.wslconfig:**
```ini
[wsl2]
memory=4GB
processors=2
swap=2GB
```

---

問題が解決しない場合は、[GitHub Issues](repository-url/issues) でサポートを求めてください。
