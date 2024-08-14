<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notes;
use App\Http\Requests\NoteRequest;

class NoteController extends Controller
{
    public function store(NoteRequest $request)
    {
        $note = Notes::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($note, 201);
    }

    public function update(NoteRequest $request, Notes $note)
    {
        $note->update($request->validated());

        return response()->json($note, 200);
    }
    public function destroy(Notes $note)
    {
        $note->delete();

        return response()->json(['message' => 'Note deleted successfully.'], 200);
    }

}
