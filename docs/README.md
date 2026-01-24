# ドキュメント一覧

English Diary App の完全ドキュメント

## 📚 クイックリンク

### 🚀 はじめに
- [README.md](../README.md) - プロジェクト概要とセットアップ手順
- [QUICKSTART.md](../QUICKSTART.md) - 5分で起動するクイックガイド

### 💻 開発
- [DEVELOPMENT.md](DEVELOPMENT.md) - 機能開発ワークフローガイド
- [COMMANDS.md](COMMANDS.md) - よく使うコマンド集
- [COMPOSE-SCRIPT.md](COMPOSE-SCRIPT.md) - bin/compose スクリプトガイド（推奨）

### 🛠 トラブルシューティング
- [WSL2-TROUBLESHOOTING.md](WSL2-TROUBLESHOOTING.md) - WSL2環境の問題解決

## 📖 ドキュメント構成

```
english-diary-app/
├── README.md                    # メインドキュメント（必読）
├── QUICKSTART.md                # クイックスタートガイド
├── .env.example                 # 環境変数テンプレート
├── bin/
│   └── compose                  # Docker Compose ラッパースクリプト
└── docs/
    ├── README.md                # このファイル
    ├── DEVELOPMENT.md           # 開発ワークフロー
    ├── COMMANDS.md              # コマンドチートシート
    ├── COMPOSE-SCRIPT.md        # bin/compose スクリプトガイド
    └── WSL2-TROUBLESHOOTING.md  # WSL2トラブルシューティング
```

## 🎯 用途別ガイド

### 初めてセットアップする場合
1. [README.md](../README.md) - 前提条件と詳細セットアップ
2. [QUICKSTART.md](../QUICKSTART.md) - 最速起動手順

### 機能を開発する場合
1. [DEVELOPMENT.md](DEVELOPMENT.md) - API/フロントエンド開発手順
2. [COMMANDS.md](COMMANDS.md) - よく使うコマンド参照

### 問題が発生した場合
1. [WSL2-TROUBLESHOOTING.md](WSL2-TROUBLESHOOTING.md) - 権限・パフォーマンス問題
2. [README.md](../README.md#よくある問題) - 一般的な問題と解決策

### コマンドを調べる場合
1. [COMMANDS.md](COMMANDS.md) - Docker, Laravel, React, PostgreSQL のコマンド集

## 📝 各ドキュメントの内容

### README.md（メインドキュメント）
- 技術スタック
- 前提条件（Docker, WSL2）
- 詳細セットアップ手順
- 使用方法
- よくある問題
- プロジェクト構成
- 開発コマンド

### QUICKSTART.md
- 3ステップセットアップ
- 動作確認方法
- 基本的なトラブルシューティング

### DEVELOPMENT.md
- 新機能追加のワークフロー
- API開発（Laravel）
- フロントエンド開発（React）
- データベースマイグレーション
- デバッグ方法
- テスト実行

### COMMANDS.md
- Docker 操作コマンド
- Laravel Artisan コマンド
- React/npm コマンド
- PostgreSQL コマンド
- Git コマンド
- 便利なエイリアス設定

### WSL2-TROUBLESHOOTING.md
- 権限関連の問題
- パフォーマンスの問題
- ネットワークの問題
- Docker Desktop の問題
- ファイルシステムの問題
- 完全リセット手順

## 🆘 サポート

### よくある質問

**Q: どこから始めればいい？**  
A: [QUICKSTART.md](../QUICKSTART.md) で環境を起動し、動作確認してください。

**Q: 機能を追加したい**  
A: [DEVELOPMENT.md](DEVELOPMENT.md) の手順に従ってください。

**Q: エラーが出た**  
A: [WSL2-TROUBLESHOOTING.md](WSL2-TROUBLESHOOTING.md) で該当する問題を探してください。

**Q: コマンドを忘れた**  
A: [COMMANDS.md](COMMANDS.md) でコマンドを検索してください。

### それでも解決しない場合

1. プロジェクトの GitHub Issues を確認
2. 新しい Issue を作成（以下の情報を含めてください）
   - エラーメッセージ
   - 実行したコマンド
   - `docker compose ps` の出力
   - `docker compose logs` の関連部分

## 🔄 ドキュメントの更新

ドキュメントの改善提案は大歓迎です！

```bash
# ドキュメント編集後
git add docs/
git commit -m "docs: update DEVELOPMENT.md with new examples"
git push
```

---

Happy Coding! 🚀
