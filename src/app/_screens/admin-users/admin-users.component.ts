import { Component, signal, WritableSignal } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { User } from '../../_models/user';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
})
export class AdminUsersComponent {
  users: WritableSignal<User[]> = signal([]);
  loading: WritableSignal<boolean> = signal(false);

  query = '';

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  searchUsers() {
    if (this.query.trim() === '' || this.loading()) return;
    this.loading.set(true);
    this.adminService.getUsersBySearch(this.query).subscribe({
      next: (users) => {
        this.users.set(users);
        this.query = '';
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Failed to search users');
        this.loading.set(false);
      },
    });
  }

  searchUsersEnter($event: KeyboardEvent) {
    if ($event.key === 'Enter') this.searchUsers();
  }

  showAllUsers() {
    if (this.loading()) return;
    this.loading.set(true);
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.query = '';
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Failed to get all users');
        this.loading.set(false);
      },
    });
  }

  deleteUser(userId: string) {
    if (this.loading()) return;
    this.loading.set(true);
    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        this.users.set(this.users().filter((user) => user.id !== userId));
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Failed to delete user');
        this.loading.set(false);
      },
    });
  }
}
