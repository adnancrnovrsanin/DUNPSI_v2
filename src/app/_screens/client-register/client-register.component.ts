import { Component, signal, WritableSignal } from '@angular/core';
import { CreateSoftwareCompanyCredentials } from '../../_models/softwareCompany';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../_services/account.service';
import { ImageService } from '../../_services/image.service';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-register',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './client-register.component.html',
  styleUrl: './client-register.component.scss',
})
export class ClientRegisterComponent {
  validationErrors: string[] | undefined;
  loading: WritableSignal<boolean> = signal(false);

  constructor(
    private accountService: AccountService,
    public imageService: ImageService,
    private router: Router
  ) {}

  registrationForm = new FormGroup({
    representativeName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    representativeSurname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      this.matchValues('password'),
    ]),
    companyName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    address: new FormControl(''),
    contact: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    web: new FormControl(''),
  });

  get representativeName() {
    return this.registrationForm.get('representativeName');
  }
  get representativeSurname() {
    return this.registrationForm.get('representativeSurname');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get password() {
    return this.registrationForm.get('password');
  }
  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }
  get companyName() {
    return this.registrationForm.get('companyName');
  }
  get address() {
    return this.registrationForm.get('address');
  }
  get contact() {
    return this.registrationForm.get('contact');
  }
  get web() {
    return this.registrationForm.get('web');
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { notMatching: true };
    };
  }

  onSubmit() {
    this.loading.set(true);
    const registrationData: CreateSoftwareCompanyCredentials = {
      user: {
        name: this.representativeName?.value ?? '',
        surname: this.representativeSurname?.value ?? '',
        email: this.email?.value ?? '',
        password: this.password?.value ?? '',
      },
      companyName: this.companyName?.value ?? '',
      address: this.address?.value ?? '',
      contact: this.contact?.value ?? '',
      web: this.web?.value ?? '',
    };

    this.accountService.createSoftwareCompany(registrationData).subscribe({
      next: () => {
        console.log('Registration successful');
        this.registrationForm.reset();
        this.loading.set(false);
        this.router.navigate(['/projects']);
      },
      error: (error) => {
        console.log(error);
        this.validationErrors = error;
        this.loading.set(false);
      },
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
