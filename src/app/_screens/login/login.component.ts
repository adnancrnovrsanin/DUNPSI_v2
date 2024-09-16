import { Component, OnDestroy, signal, WritableSignal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../_services/account.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../_services/profile.service';
import { LoginDto } from '../../_dtos/AuthDtos';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { ImageService } from '../../_services/image.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  validationErrors: string[] | undefined;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  submitting: WritableSignal<boolean> = signal(false);

  constructor(
    private accountService: AccountService,
    public imageService: ImageService,
    private router: Router
  ) {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    console.log(this.email?.value);
    console.log(this.password?.value);
    if (this.email?.value == null || this.password?.value == null) return;
    const loginCreds: LoginDto = {
      email: this.email.value,
      password: this.password.value,
    };

    this.submitting.set(true);
    this.accountService.login(loginCreds).subscribe({
      next: (_) => {
        console.log('Login successful');
      },
      error: (err) => {
        console.log(err);
        this.validationErrors = err;
        this.submitting.set(false);
      },
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.submitting.set(false);
  }
}
