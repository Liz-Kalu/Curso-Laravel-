<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Personal;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        // Personal que aún NO tiene una cuenta de usuario ligada
        $idsConCuenta = User::whereNotNull('id_personal')->pluck('id_personal');

        $personalDisponible = Personal::whereNotIn('id', $idsConCuenta)
            ->orderBy('nombre')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'nombre_completo' => $p->nombre_completo,
            ]);

        return Inertia::render('Auth/Register', [
            'personalDisponible' => $personalDisponible,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'id_personal' => [
                'required',
                'exists:personal,id',
                Rule::unique('users', 'id_personal'),
            ],
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $personal = Personal::findOrFail($request->id_personal);

        $user = User::create([
            'id_personal' => $personal->id,
            'name' => $personal->nombre_completo,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
