import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { ImageService } from '../../_services/image.service';

@Component({
  selector: 'app-home-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home-navbar.component.html',
  styleUrl: './home-navbar.component.scss',
})
export class HomeNavbarComponent {
  constructor(
    public accountService: AccountService,
    private router: Router,
    public imageService: ImageService
  ) {}

  goToDashboard() {
    const currentUser = this.accountService.currentUser();
    if (!currentUser) return;
    if (currentUser.role === 'SOFTWARE_COMPANY') {
      this.router.navigate(['/projects']);
    } else {
      this.router.navigate(['/messages']);
    }
  }
}
