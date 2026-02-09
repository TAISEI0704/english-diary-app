<?php

declare(strict_types=1);

namespace App\UseCases\Diary;

use App\Queries\Diary\DiaryQuery;
use Carbon\CarbonImmutable;

class ShowUseCase
{
    public function __construct(
        private readonly DiaryQuery $diaryQuery,
    )
    {}

    public function __invoke(array $data)
    {
        $date = CarbonImmutable::parse($data['date']);

        $diary = $this->diaryQuery->getDiaryByDate($date->toDateString());

        if (!$diary) {
            return null;
        }

        return $diary;
    }
}