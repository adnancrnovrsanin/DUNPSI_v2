import { Component, computed, HostBinding, Input, Signal } from '@angular/core';
import { User } from '../../_models/user';
import { PresenceService } from '../../_services/presence.service';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @HostBinding('aria-expanded') expanded = false;
  @HostBinding('data-dropdown-toggle') dropdownToggle = '';

  @Input() user: User | null = null;

  constructor(private presenceService: PresenceService) {}

  isOnline: Signal<boolean> = computed(() =>
    this.presenceService.onlineUsers().includes(this.user?.email ?? '')
  );

  getNameInitials() {
    const name = this.user?.name ?? '';
    const surname = this.user?.surname ?? '';

    return `${name.charAt(0)}${surname.charAt(0)}`;
  }
}
