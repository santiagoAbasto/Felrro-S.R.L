<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Post;

class PostController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | LISTADO /novedades
    |--------------------------------------------------------------------------
    */
    public function index()
    {
        $posts = Post::published()
            ->latest('published_at')
            ->paginate(9);

        return view('web.posts.index', compact('posts'));
    }

    /*
    |--------------------------------------------------------------------------
    | DETALLE /novedades/{slug}
    |--------------------------------------------------------------------------
    */
    public function show(string $slug)
    {
        $post = Post::published()
            ->where('slug', $slug)
            ->firstOrFail();

        return view('web.posts.show', compact('post'));
    }
}