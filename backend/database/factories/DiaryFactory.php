<?php

namespace Database\Factories;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Diary>
 */
class DiaryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'entry_date' => $this->faker->date(),
            'diary_text' => $this->faker->paragraph(),
            'english_phrase' => $this->faker->sentence(),
            'status' => $this->faker->numberBetween(0, 2),
        ];
    }

    public function today(): static
    {
        return $this->state([
            'entry_date' => CarbonImmutable::now()->toDateString(),
        ]);
    }

    public function past(): static
    {
        return $this->state([
            'entry_date' => $this->faker->unique()
                ->dateTimeBetween('-1 month', '-1 day')
                ->format('Y-m-d'),
        ]);
    }
}
