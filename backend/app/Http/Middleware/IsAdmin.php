<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        /** @var User $user */
        $user = Auth::user();
        if ($user && $user->isAdmin()) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }
}
