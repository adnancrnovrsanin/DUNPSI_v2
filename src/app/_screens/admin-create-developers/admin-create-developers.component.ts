import { ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal } from '@angular/core';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CreateDeveloperDto } from '../../_models/profiles';
import { AdminService } from '../../_services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-admin-create-developers',
  standalone: true,
  imports: [TextInputComponent, ReactiveFormsModule],
  templateUrl: './admin-create-developers.component.html',
  styleUrl: './admin-create-developers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCreateDevelopersComponent implements OnInit {
  loading: WritableSignal<boolean> = signal(false);
  newDeveloperForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    surname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    position: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
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
    return this.newDeveloperForm.get('name');
  }

  get surname() {
    return this.newDeveloperForm.get('surname');
  }

  get email() {
    return this.newDeveloperForm.get('email');
  }

  get position() {
    return this.newDeveloperForm.get('position');
  }

  get password() {
    return this.newDeveloperForm.get('password');
  }

  get confirmPassword() {
    return this.newDeveloperForm.get('confirmPassword');
  }

  onSubmit() {
    this.loading.set(true);
    const createDeveloperData: CreateDeveloperDto = {
      user: {
        name: this.name?.value ?? '',
        surname: this.surname?.value ?? '',
        email: this.email?.value ?? '',
        password: this.password?.value ?? '',
      },
      position: this.position?.value ?? '',
      numberOfActiveTasks: 0,
    };

    this.adminService.createDeveloper(createDeveloperData).subscribe({
      next: () => {
        this.toastr.success('Developer created successfully');
        this.newDeveloperForm.reset();
        this.loading.set(false);
      },
      error: (error) => {
        this.toastr.error(error);
        this.loading.set(false);
      },
    });
  }
}
