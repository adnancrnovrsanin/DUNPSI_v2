import { Component, computed, Signal } from '@angular/core';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  user: Signal<User | null> = computed(() => this.accountService.currentUser());

  constructor(private accountService: AccountService) {}
}
