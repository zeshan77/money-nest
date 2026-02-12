<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        $users = User::query()
            ->select('id', 'name', 'role')
            ->orderByRaw("CASE WHEN role = 'parent' THEN 0 ELSE 1 END")
            ->orderBy('name')
            ->get();

        return Inertia::render('Auth/Login', [
            'users' => $users,
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'pin' => ['required', 'string', 'size:4'],
        ]);

        $user = User::findOrFail($request->user_id);

        if (! Hash::check($request->pin, $user->pin)) {
            return back()->withErrors([
                'pin' => 'Incorrect PIN.',
            ]);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended('/dashboard');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
