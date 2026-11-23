import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserServices } from '../services/user-services';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private _userService = inject(UserServices);
  private _router = inject(Router);

  email = "";
  password = "";
  error = signal<string>("");
  isSending = signal<boolean>(false);

  async submit() {
    this.error.set("");
    if (!this.email.trim() || !this.password) {
      this.error.set("Fill in your email and password.");
      return;
    }
    this.isSending.set(true);
    const result = await this._userService.login({ email: this.email.trim(), password: this.password });
    this.isSending.set(false);
    if (result.ok) this._router.navigate(['/']);
    else this.error.set(result.error);
  }
}
