import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from './api';
import { LoggedUser, LoginRequest, SignupRequest } from '../models/user';

export type AuthResult =
    | { ok : true; user : LoggedUser }
    | { ok : false; error : string };

const STORAGE_KEY = "loggedUser";

@Injectable({
    providedIn: "root"
})
export class UserServices {
    private _http = inject(HttpClient);

    async signup(data : SignupRequest) : Promise<AuthResult> {
        try {
            const user = await firstValueFrom(
                this._http.post<LoggedUser>(`${API_URL}/user`, data)
            );
            return { ok: true, user };
        }
        catch(error) {
            return { ok: false, error: this.errorMessage(error, "Could not create the account. This email may already be in use.") };
        }
    }

    async login(data : LoginRequest) : Promise<AuthResult> {
        try {
            const user = await firstValueFrom(
                this._http.post<LoggedUser>(`${API_URL}/user/login`, data)
            );
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            return { ok: true, user };
        }
        catch(error) {
            return { ok: false, error: this.errorMessage(error, "Incorrect email or password.") };
        }
    }

    private errorMessage(error : unknown, badRequestMessage : string) : string {
        if (error instanceof HttpErrorResponse && error.status === 400)
            return badRequestMessage;
        return "Could not reach the server. Try again later.";
    }
}
