import { Component, inject } from '@angular/core';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { HomeNavbarComponent } from "../../_components/home-navbar/home-navbar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeNavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly alerts = inject(TuiAlertService);

  protected showNotification(): void {
    this.alerts
      .open('Basic <strong>HTML</strong>', {
        label: 'HTML',
        appearance: 'success',
      })
      .subscribe();
  }
}
