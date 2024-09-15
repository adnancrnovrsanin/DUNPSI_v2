import { Component, signal, WritableSignal } from '@angular/core';
import { User } from '../../_models/user';
import { AdminService } from '../../_services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  users: WritableSignal<User[]> = signal([]);
  flag: boolean = false;

  constructor(private adminService: AdminService) {
    this.adminService.getAllUsers().subscribe((users) => {
      this.users.set(users);
    });
  }

  search($event: Event) {
    if (this.flag) return;
    const input = $event.target as HTMLInputElement;
    const inputValue = input.value;
    if (inputValue.length === 0) {
      console.log('nesto');
      this.adminService.getAllUsers().subscribe((users) => {
        this.users.set(users);
      });
    } else {
      this.flag = true;
      setTimeout(() => {
        this.adminService.searchUsers(inputValue).subscribe((users) => {
          this.users.set(users);
        });
        this.flag = false;
      }, 200);
    }
  }
}
