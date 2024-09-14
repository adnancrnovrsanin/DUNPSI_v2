import { Component } from '@angular/core';
import { HomeNavbarComponent } from '../../_components/home-navbar/home-navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeNavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
