<?php

namespace App\Http\Resources\Diary;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $dairy = $this->resource;

        return [
            'id' => $dairy->id ? $dairy->id : null,
            'user_id' => $dairy->user_id ? $dairy->user_id : null,
            'entry_date' => $dairy->entry_date->toDateString() ? $dairy->entry_date->toDateString() : null,
            'diary_text' => $dairy->diary_text ? $dairy->diary_text : '',
            'english_phrase' => $dairy->english_phrase ? $dairy->english_phrase : '',
            'status' => $dairy->status ? $dairy->status : 0,
        ];
    }
}
