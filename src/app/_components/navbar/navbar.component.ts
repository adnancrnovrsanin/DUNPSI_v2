import { Component, computed, OnInit, Signal } from '@angular/core';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { PresenceService } from '../../_services/presence.service';
import { AvatarComponent } from '../avatar/avatar.component';
import { ImageService } from '../../_services/image.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  user: Signal<User | null> = computed(() => this.accountService.currentUser());
  isOnline: Signal<boolean> = computed(
    () =>
      this.accountService.currentUser() !== null &&
      this.presenceService
        .onlineUsers()
        .includes(this.accountService.currentUser()?.email ?? '')
  );

  constructor(
    private accountService: AccountService,
    private presenceService: PresenceService,
    public imageService: ImageService
  ) {}

  logout() {
    this.accountService.logout();
  }

  ngOnInit(): void {
    this.darkMode();
  }

  darkMode() {
    var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    var themeToggleLightIcon = document.getElementById(
      'theme-toggle-light-icon'
    );

    // Change the icons inside the button based on previous settings
    if (
      localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      themeToggleLightIcon?.classList.remove('hidden');
    } else {
      themeToggleDarkIcon?.classList.remove('hidden');
    }

    var themeToggleBtn = document.getElementById('theme-toggle');

    themeToggleBtn?.addEventListener('click', function () {
      // toggle icons inside button
      themeToggleDarkIcon?.classList.toggle('hidden');
      themeToggleLightIcon?.classList.toggle('hidden');

      // if set via local storage previously
      if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
          document.documentElement.classList.add('dark');
          localStorage.setItem('color-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('color-theme', 'light');
        }

        // if NOT set via local storage previously
      } else {
        if (document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('color-theme', 'light');
        } else {
          document.documentElement.classList.add('dark');
          localStorage.setItem('color-theme', 'dark');
        }
      }
    });
  }

  toggleTheme() {
    this.imageService.logoImage.update((value) =>
      value === '/assets/ColoredLogo.png'
        ? '/assets/WhiteLogo.png'
        : '/assets/ColoredLogo.png'
    );
  }

  getNameInitials() {
    const name = this.user()?.name ?? '';
    const surname = this.user()?.surname ?? '';

    return `${name.charAt(0)}${surname.charAt(0)}`;
  }
}
