import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserServices } from '../services/user-services';

type AccountType = "user" | "company";

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-signup',
  styleUrl: './signup.css',
  templateUrl: './signup.html',
})
export class Signup {
  private _userService = inject(UserServices);
  private _router = inject(Router);

  accountType: AccountType = "user";
  name = "";
  email = "";
  password = "";
  error = signal<string>("");
  isSending = signal<boolean>(false);

  private validate() : string {
    const name = this.name.trim();
    if (name.length < 3 || name.length > 100) return "Name must have between 3 and 100 characters.";
    if (!EMAIL_PATTERN.test(this.email.trim())) return "Enter a valid email.";
    if (this.password.length < 6 || this.password.length > 30) return "Password must have between 6 and 30 characters.";
    return "";
  }

  async submit() {
    const validationError = this.validate();
    this.error.set(validationError);
    if (validationError) return;

    this.isSending.set(true);
    const result = await this._userService.signup({
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password,
      isCompany: this.accountType === "company"
    });
    this.isSending.set(false);
    if (result.ok) this._router.navigate(['/login']);
    else this.error.set(result.error);
  }
}
