<?php

declare(strict_types=1);

namespace App\Queries\Diary;

use App\Models\Diary;

/**
 * 日記クエリ
 */
class DiaryQuery
{
    /**
     * 指定日の日記エントリーを取得する
     */
    public function getDiaryByDate(string $date): ?Diary
    {
        return Diary::whereDate('entry_date', $date)->first();
    }
}