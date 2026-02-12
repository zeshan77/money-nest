<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsParent
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->isParent()) {
            abort(403, 'Only parents can access this page.');
        }

        return $next($request);
    }
}
