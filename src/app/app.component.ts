import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FooterComponent } from './_components/footer/footer.component';
import { HomeNavbarComponent } from './_components/home-navbar/home-navbar.component';
import { NavbarComponent } from './_components/navbar/navbar.component';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { initFlowbite } from 'flowbite';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxSpinnerModule,
    FooterComponent,
    HomeNavbarComponent,
    NavbarComponent,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'DUNPSI';

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    initFlowbite();
    this.setCurrentUser();
  }

  isHomePage(): boolean {
    return this.router.url === '/';
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
