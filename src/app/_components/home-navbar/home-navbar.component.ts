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
    if (this.accountService.currentUser()?.role === 'ADMIN') {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate([
        '/dashboard',
        this.accountService.currentUser()?.id,
      ]);
    }
  }
}
