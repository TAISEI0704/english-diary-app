# 開発ガイド

English Diary App の機能開発ワークフロー

## 📋 目次

- [開発環境の起動](#開発環境の起動)
- [新機能の追加](#新機能の追加)
- [API開発ワークフロー](#api開発ワークフロー)
- [フロントエンド開発ワークフロー](#フロントエンド開発ワークフロー)
- [データベース変更](#データベース変更)
- [デバッグ方法](#デバッグ方法)
- [テスト](#テスト)
- [コードスタイル](#コードスタイル)

## 🚀 開発環境の起動

```bash
# コンテナ起動
docker compose up -d

# ログ監視（開発中は別ターミナルで実行推奨）
docker compose logs -f
```

## ✨ 新機能の追加

### 例: 日記エントリCRUD機能の実装

#### 1. データベース設計

```bash
# マイグレーション作成
docker compose exec frankenphp-laravel php artisan make:migration create_diary_entries_table
```

**database/migrations/xxxx_create_diary_entries_table.php:**
```php
public function up()
{
    Schema::create('diary_entries', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('content');
        $table->date('entry_date');
        $table->timestamps();
    });
}
```

```bash
# マイグレーション実行
docker compose exec frankenphp-laravel php artisan migrate
```

#### 2. モデル作成

```bash
# モデル作成
docker compose exec frankenphp-laravel php artisan make:model DiaryEntry
```

**app/Models/DiaryEntry.php:**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiaryEntry extends Model
{
    protected $fillable = [
        'title',
        'content',
        'entry_date',
    ];

    protected $casts = [
        'entry_date' => 'date',
    ];
}
```

#### 3. APIコントローラー作成

```bash
# APIコントローラー作成
docker compose exec frankenphp-laravel php artisan make:controller Api/DiaryEntryController --api
```

**app/Http/Controllers/Api/DiaryEntryController.php:**
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DiaryEntry;
use Illuminate\Http\Request;

class DiaryEntryController extends Controller
{
    public function index()
    {
        return DiaryEntry::orderBy('entry_date', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'entry_date' => 'required|date',
        ]);

        $entry = DiaryEntry::create($validated);

        return response()->json($entry, 201);
    }

    public function show(DiaryEntry $diaryEntry)
    {
        return $diaryEntry;
    }

    public function update(Request $request, DiaryEntry $diaryEntry)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'content' => 'string',
            'entry_date' => 'date',
        ]);

        $diaryEntry->update($validated);

        return response()->json($diaryEntry);
    }

    public function destroy(DiaryEntry $diaryEntry)
    {
        $diaryEntry->delete();

        return response()->json(null, 204);
    }
}
```

#### 4. ルート定義

**routes/api.php:**
```php
use App\Http\Controllers\Api\DiaryEntryController;

Route::apiResource('diary-entries', DiaryEntryController::class);
```

```bash
# ルート確認
docker compose exec frankenphp-laravel php artisan route:list
```

#### 5. フロントエンド実装

**frontend/src/services/diaryApi.js:**
```javascript
import api from './api';

export const diaryApi = {
  // すべての日記を取得
  getAll: () => api.get('/diary-entries'),

  // 日記を1件取得
  getOne: (id) => api.get(`/diary-entries/${id}`),

  // 日記を作成
  create: (data) => api.post('/diary-entries', data),

  // 日記を更新
  update: (id, data) => api.put(`/diary-entries/${id}`, data),

  // 日記を削除
  delete: (id) => api.delete(`/diary-entries/${id}`),
};
```

**frontend/src/components/DiaryList.jsx:**
```javascript
import { useState, useEffect } from 'react';
import { diaryApi } from '../services/diaryApi';

function DiaryList() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const response = await diaryApi.getAll();
      setEntries(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>My Diary Entries</h2>
      {entries.map(entry => (
        <div key={entry.id}>
          <h3>{entry.title}</h3>
          <p>{entry.entry_date}</p>
          <p>{entry.content}</p>
        </div>
      ))}
    </div>
  );
}

export default DiaryList;
```

## 🔧 API開発ワークフロー

### リクエストバリデーション

**app/Http/Requests/StoreDiaryEntryRequest.php:**
```bash
docker compose exec frankenphp-laravel php artisan make:request StoreDiaryEntryRequest
```

```php
public function rules()
{
    return [
        'title' => 'required|string|max:255',
        'content' => 'required|string|min:10',
        'entry_date' => 'required|date|before_or_equal:today',
    ];
}
```

### APIリソース（レスポンス整形）

```bash
docker compose exec frankenphp-laravel php artisan make:resource DiaryEntryResource
```

**app/Http/Resources/DiaryEntryResource.php:**
```php
public function toArray($request)
{
    return [
        'id' => $this->id,
        'title' => $this->title,
        'content' => $this->content,
        'entry_date' => $this->entry_date->format('Y-m-d'),
        'created_at' => $this->created_at->toISOString(),
    ];
}
```

### CORS設定

**bootstrap/app.php** で既に設定済み（localhost:3000を許可）

追加のオリジンを許可する場合：
```php
$middleware->api(prepend: [
    \Illuminate\Http\Middleware\HandleCors::class,
]);
```

## 🎨 フロントエンド開発ワークフロー

### コンポーネント作成の基本構造

```
frontend/src/
├── components/
│   ├── DiaryList.jsx       # 一覧表示
│   ├── DiaryForm.jsx       # 作成・編集フォーム
│   └── DiaryDetail.jsx     # 詳細表示
├── pages/
│   ├── Home.jsx
│   └── DiaryPage.jsx
├── services/
│   ├── api.js              # Axios基本設定
│   └── diaryApi.js         # Diary専用API
└── hooks/
    └── useDiaryEntries.js  # カスタムフック
```

### React Routerの設定

```bash
# React Router はインストール済み
# docker compose exec react-dev npm install react-router-dom
```

**frontend/src/main.jsx:**
```javascript
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

**frontend/src/App.jsx:**
```javascript
import { Routes, Route } from 'react-router-dom'
import DiaryList from './components/DiaryList'
import DiaryForm from './components/DiaryForm'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DiaryList />} />
      <Route path="/new" element={<DiaryForm />} />
      <Route path="/edit/:id" element={<DiaryForm />} />
    </Routes>
  )
}
```

### カスタムフック例

**frontend/src/hooks/useDiaryEntries.js:**
```javascript
import { useState, useEffect } from 'react';
import { diaryApi } from '../services/diaryApi';

export function useDiaryEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const response = await diaryApi.getAll();
      setEntries(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (data) => {
    const response = await diaryApi.create(data);
    setEntries([response.data, ...entries]);
    return response.data;
  };

  const updateEntry = async (id, data) => {
    const response = await diaryApi.update(id, data);
    setEntries(entries.map(e => e.id === id ? response.data : e));
    return response.data;
  };

  const deleteEntry = async (id) => {
    await diaryApi.delete(id);
    setEntries(entries.filter(e => e.id !== id));
  };

  return {
    entries,
    loading,
    error,
    loadEntries,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
```

## 💾 データベース変更

### マイグレーションの作成と実行

```bash
# 新しいマイグレーション作成
docker compose exec frankenphp-laravel php artisan make:migration add_tags_to_diary_entries

# マイグレーション実行
docker compose exec frankenphp-laravel php artisan migrate

# ロールバック（最後の実行を取り消し）
docker compose exec frankenphp-laravel php artisan migrate:rollback

# すべてロールバックして再実行
docker compose exec frankenphp-laravel php artisan migrate:fresh
```

### シーダーの使用

```bash
# シーダー作成
docker compose exec frankenphp-laravel php artisan make:seeder DiaryEntrySeeder

# シーダー実行
docker compose exec frankenphp-laravel php artisan db:seed

# マイグレーション + シーダー
docker compose exec frankenphp-laravel php artisan migrate:fresh --seed
```

**database/seeders/DiaryEntrySeeder.php:**
```php
public function run()
{
    DiaryEntry::create([
        'title' => 'My First Diary Entry',
        'content' => 'Today was a great day!',
        'entry_date' => now(),
    ]);
}
```

## 🐛 デバッグ方法

### Laravel デバッグ

```bash
# ログ確認
docker compose exec frankenphp-laravel tail -f storage/logs/laravel.log

# Tinker（対話式REPL）
docker compose exec frankenphp-laravel php artisan tinker
>>> App\Models\DiaryEntry::count()
>>> App\Models\DiaryEntry::first()
```

**コード内でのデバッグ:**
```php
// dd() - Dump and Die
dd($variable);

// dump() - Dump but continue
dump($variable);

// Log
use Illuminate\Support\Facades\Log;
Log::info('Debug message', ['data' => $variable]);
```

### React デバッグ

```bash
# ブラウザコンソールでログ確認
console.log('Debug:', data);

# React Dev Toolsをブラウザにインストール
# Chrome: React Developer Tools
```

### Docker デバッグ

```bash
# 全コンテナのログ
docker compose logs -f

# 特定コンテナのログ
docker compose logs -f frankenphp-laravel

# コンテナ内に入る
docker compose exec frankenphp-laravel bash
docker compose exec react-dev sh

# プロセス確認
docker compose top

# リソース使用状況
docker stats
```

## ✅ テスト

### Laravel テスト

```bash
# PHPUnit テスト作成
docker compose exec frankenphp-laravel php artisan make:test DiaryEntryTest

# テスト実行
docker compose exec frankenphp-laravel php artisan test

# 特定のテストファイルのみ実行
docker compose exec frankenphp-laravel php artisan test --filter DiaryEntryTest
```

**tests/Feature/DiaryEntryTest.php:**
```php
public function test_can_create_diary_entry()
{
    $response = $this->postJson('/api/diary-entries', [
        'title' => 'Test Entry',
        'content' => 'This is a test.',
        'entry_date' => '2024-01-24',
    ]);

    $response->assertStatus(201)
             ->assertJson([
                 'title' => 'Test Entry',
             ]);

    $this->assertDatabaseHas('diary_entries', [
        'title' => 'Test Entry',
    ]);
}
```

### React テスト

```bash
# Vitest テスト実行（Viteに統合）
docker compose exec react-dev npm run test

# カバレッジ付きテスト
docker compose exec react-dev npm run test:coverage
```

## 📐 コードスタイル

### Laravel (PHP)

```bash
# Laravel Pint（コードフォーマッター）
docker compose exec frankenphp-laravel ./vendor/bin/pint

# 特定ファイルのみ
docker compose exec frankenphp-laravel ./vendor/bin/pint app/Models
```

### React (JavaScript)

```bash
# ESLint（リンター）
docker compose exec react-dev npm run lint

# Prettier（フォーマッター）
docker compose exec react-dev npm run format
```

## 🔄 開発の流れ（まとめ）

1. **機能設計** - どんな機能を作るか決める
2. **データベース** - マイグレーション・モデル作成
3. **バックエンドAPI** - コントローラー・ルート作成
4. **APIテスト** - curlやPostmanで動作確認
5. **フロントエンド** - コンポーネント・API連携
6. **統合テスト** - ブラウザで動作確認
7. **テストコード** - 自動テスト作成
8. **コミット** - Git にコミット

## 💡 Tips

### ホットリロードが遅い場合

```javascript
// vite.config.js で除外ディレクトリ指定
export default defineConfig({
  server: {
    watch: {
      ignored: ['**/vendor/**', '**/storage/**']
    }
  }
})
```

### APIレスポンスを整形して確認

```bash
# jq がインストール済みの場合
curl -s http://localhost:8000/api/diary-entries | jq .

# jq がない場合
curl http://localhost:8000/api/diary-entries | python -m json.tool
```

### PostgreSQL データ確認

```bash
# 特定テーブルのデータ確認
docker compose exec postgres psql -U diary_user -d english_diary -c "SELECT * FROM diary_entries LIMIT 5;"
```

---

**Happy Coding! 🚀**
