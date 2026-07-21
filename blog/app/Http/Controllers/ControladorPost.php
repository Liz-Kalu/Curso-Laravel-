<?php

namespace App\Http\Controllers;

use App\Http\Requests\SavePostRequest;
use App\Models\Post;

class ControladorPost extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')-> except(['index', 'show']);
    }

    public function index()
    {
        $posts = Post::get();

        return view('posts.index', ['posts' => $posts]);
    }

    // public function show($post)
    // {
    //    return Post::findOrFail($post);
    // } es lo mismo que lo siguente
    public function show(Post $post)
    {
        return view('posts.show', ['post' => $post]);
    }

    public function create()
    {
        return view('posts.create', ['post' => new Post]);
    }

    public function store(SavePostRequest $request)
    {

        // $post = new Post;
        // $post->title = $request->input('title');
        // $post->body = $request->input('body');
        // $post->save();
        Post::create($request->validated());

        // session()->flash('estatus', 'Post creado!');

        return to_route('posts.index')->with('estatus', 'Post creado!');
    }

    public function edit(Post $post)
    {
        return view('posts.edit', ['post' => $post]);

    }

    public function update(SavePostRequest $request, Post $post)
    {

        //        $post->title = $request->input('title');
        //        $post->body = $request->input('body');
        //        $post->save();

        $post->update($request->validated());

        return to_route('posts.show', $post)->with('estatus', 'Post actualizado!');
    }

    public function destroy(Post $post)
    {
        $post->delete();

        return to_route('posts.index')->with('estatus', 'Post eliminado!');
    }
}
