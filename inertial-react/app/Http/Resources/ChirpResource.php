<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChirpResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return[
            'id' => $this->resource->id,
            'message'=> $this-> resource-> message,
            'createdAt'=> $this-> resource->created_at->diffForHumans(),
            'edited'=> $this-> resource->created_at != $this-> resource->updated_at,
            'user'=>UserResource::make ($this->whenLoaded('user')),
            ];
    }
}
