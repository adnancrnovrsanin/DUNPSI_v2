import { Component, OnInit } from '@angular/core';
import { HomeNavbarComponent } from '../../_components/home-navbar/home-navbar.component';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeNavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    initFlowbite();
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
