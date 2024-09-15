import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-add-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-add-user.component.html',
  styleUrl: './admin-add-user.component.scss',
})
export class AdminAddUserComponent {
  addUserForm: FormGroup;

  constructor(fb: FormBuilder, private toastr: ToastrService) {
    this.addUserForm = fb.group(
      {
        name: ['', Validators.required],
        surename: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required, Validators.minLength(6)],
        confirmPassword: ['', Validators.required],
      }
      // { validator: this.passwordMatchValidator }
    );
  }

  // passwordMatchValidator(
  //   control: AbstractControl
  // ): { [key: string]: boolean } | null {
  //   const password = control.get('password');
  //   const confirmPassword = control.get('confirmPassword');
  //   if (
  //     password &&
  //     confirmPassword &&
  //     password.value !== confirmPassword.value
  //   ) {
  //     this.toastr.error('Passwords do not match');
  //     return { mismatch: true };
  //   }
  //   return null;
  // }

  onSubmit(): void {
    console.log(this.addUserForm.value);
    if (this.addUserForm.valid) {
      console.log('Form Submitted', this.addUserForm.value);
      this.toastr.success('User added successfully');
      // Handle form submission logic here
    } else {
      console.warn('Form is invalid');
      this.toastr.error('Please fill all fields');
    }
  }
}
