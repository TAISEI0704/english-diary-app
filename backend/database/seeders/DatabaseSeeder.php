<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Diary;
use Carbon\CarbonImmutable;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create();

        Diary::firstOrCreate(
            [
                'user_id' => $user->id,
                'entry_date' => now()->toDateString(),
            ],
            Diary::factory()->for($user)->today()->make()->toArray()
        );

        $dates = collect(range(1, 31))
            ->map(fn ($i) => CarbonImmutable::today()->subDays($i)->toDateString())
            ->shuffle()
            ->take(20);

        foreach ($dates as $d) {
            // 既にあればスキップ（Seederを何回回しても落ちない）
            if (Diary::where('user_id', $user->id)->where('entry_date', $d)->exists()) {
                continue;
            }

            Diary::factory()
                ->for($user)
                ->create(['entry_date' => $d]);
        }
    }
}
