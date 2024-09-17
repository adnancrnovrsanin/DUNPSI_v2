import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import {
  CreateDeveloperDto,
  CreateProductManagerDto,
} from '../../_models/profiles';
import { AdminService } from '../../_services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-admin-create-product-managers',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './admin-create-product-managers.component.html',
  styleUrl: './admin-create-product-managers.component.scss',
})
export class AdminCreateProductManagersComponent implements OnInit {
  loading: WritableSignal<boolean> = signal(false);
  newProductManagerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    surname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
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
  });

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    initFlowbite();
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { notMatching: true };
    };
  }

  get name() {
    return this.newProductManagerForm.get('name');
  }

  get surname() {
    return this.newProductManagerForm.get('surname');
  }

  get email() {
    return this.newProductManagerForm.get('email');
  }

  get password() {
    return this.newProductManagerForm.get('password');
  }

  get confirmPassword() {
    return this.newProductManagerForm.get('confirmPassword');
  }

  onSubmit() {
    this.loading.set(true);
    const CreateProductManagerData: CreateProductManagerDto = {
      user: {
        name: this.name?.value ?? '',
        surname: this.surname?.value ?? '',
        email: this.email?.value ?? '',
        password: this.password?.value ?? '',
      },
    };

    this.adminService.createProductManager(CreateProductManagerData).subscribe({
      next: () => {
        this.toastr.success('Product Manager created successfully');
        this.newProductManagerForm.reset();
        this.loading.set(false);
      },
      error: (error) => {
        this.toastr.error(error.error);
        this.loading.set(false);
      },
    });
  }
}
