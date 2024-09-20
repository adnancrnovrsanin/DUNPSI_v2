import { ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal } from '@angular/core';
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
  CreateProjectManagerDto,
} from '../../_models/profiles';
import { AdminService } from '../../_services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-admin-create-project-managers',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './admin-create-project-managers.component.html',
  styleUrl: './admin-create-project-managers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCreateProjectManagersComponent implements OnInit {
  loading: WritableSignal<boolean> = signal(false);
  newProjectManagerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    surname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    certificateUrl: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    yearsOfExperience: new FormControl(0, [
      Validators.required,
      Validators.min(1),
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
    return this.newProjectManagerForm.get('name');
  }

  get surname() {
    return this.newProjectManagerForm.get('surname');
  }

  get email() {
    return this.newProjectManagerForm.get('email');
  }

  get certificateUrl() {
    return this.newProjectManagerForm.get('certificateUrl');
  }

  get yearsOfExperience() {
    return this.newProjectManagerForm.get('yearsOfExperience');
  }

  get password() {
    return this.newProjectManagerForm.get('password');
  }

  get confirmPassword() {
    return this.newProjectManagerForm.get('confirmPassword');
  }

  onSubmit() {
    this.loading.set(true);
    const createProjectManagerData: CreateProjectManagerDto = {
      user: {
        name: this.name?.value ?? '',
        surname: this.surname?.value ?? '',
        email: this.email?.value ?? '',
        password: this.password?.value ?? '',
      },
      certificateUrl: this.certificateUrl?.value ?? '',
      yearsOfExperience: this.yearsOfExperience?.value ?? 0,
    };

    this.adminService.createProjectManager(createProjectManagerData).subscribe({
      next: () => {
        this.toastr.success('Project Manager created successfully');
        this.newProjectManagerForm.reset();
        this.loading.set(false);
      },
      error: (error) => {
        this.toastr.error('Error creating Project Manager');
        this.loading.set(false);
      },
    });
  }
}
