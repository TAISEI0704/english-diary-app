<?php

declare(strict_types=1);

namespace App\Http\Controllers\Diary;

use App\Http\Controllers\Controller;
use App\Http\Requests\Diary\ShowRequest;
use App\Http\Resources\Diary\ShowResource;
use App\UseCases\Diary\ShowUseCase;

final class ShowController extends Controller
{
    public function __invoke(ShowRequest $request, ShowUseCase $useCase)
    {
        $diary = $useCase($request->validated());

        return response()->json([
            'entry_date' => $diary ? new ShowResource($diary) : null,
        ]);
    }
}