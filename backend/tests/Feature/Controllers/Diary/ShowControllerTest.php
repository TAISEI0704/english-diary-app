<?php

declare(strict_types=1);

namespace Tests\Feature\Controllers\Diary;

use App\Models\Diary;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * ShowControllerのテスト
 * 
 * テスト戦略:
 * - RefreshDatabaseを使用してテスト環境のDBをクリーンに保つ
 */
class ShowControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // テスト用の日記エントリーを作成
        Diary::factory()->create([
            'entry_date' => CarbonImmutable::now()->subDays(1)->toDateString(),
        ]);
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }

    public function test_正常系_指定日の日記エントリーを取得できること(): void
    {
        $date = CarbonImmutable::now()->subDays(1)->toDateString();

        $response = $this->getJson(route('diary.show', ['date' => $date]));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'entry_date' => [
                    'id',
                    'user_id',
                    'entry_date',
                    'diary_text',
                    'english_phrase',
                    'status',
                ],
            ]);
    }

    public function test_正常系_指定日が今日の日付の場合今日の日記エントリーを取得できること(): void
    {
        Diary::factory()->today()->create([
            'diary_text' => 'This is today\'s diary entry.',
        ]);
        $date = CarbonImmutable::now()->toDateString();

        $response = $this->getJson(route('diary.show', ['date' => $date]));

        $response->assertStatus(200)
            ->assertJsonFragment([
                'diary_text' => 'This is today\'s diary entry.',
            ]);
    }

    public function test_異常系_指定日が未来の日付の場合バリデーションエラーとなること(): void
    {
        $date = CarbonImmutable::now()->addDays(1)->toDateString();

        $response = $this->getJson(route('diary.show', ['date' => $date]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['date']);
    }

    public function test_異常系_該当する日記のデータが存在しない場合空のデータが返ること(): void
    {
        $date = CarbonImmutable::now()->subDays(10)->toDateString();

        $response = $this->getJson(route('diary.show', ['date' => $date]));

        $response->assertStatus(200)
            ->assertJson([
                'entry_date' => null,
            ]);
    }
}