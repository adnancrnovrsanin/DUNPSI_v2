import {
  Component,
  computed,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../../_services/message.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AvatarComponent } from '../../_components/avatar/avatar.component';
import { PresenceService } from '../../_services/presence.service';
import { NgClass } from '@angular/common';
import { TimeAgoPipe } from '../../_pipes/time-ago.pipe';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCheckCheck } from '@ng-icons/lucide';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    AvatarComponent,
    FormsModule,
    NgClass,
    TimeAgoPipe,
    NgIconComponent,
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss',
  viewProviders: [provideIcons({ lucideCheckCheck })],
})
export class ChatPageComponent implements OnInit, OnDestroy {
  email: WritableSignal<string | null> = signal(null);
  user: WritableSignal<User | null> = signal(null);
  loading: WritableSignal<boolean> = signal(false);
  messageContent = '';

  @ViewChild('messageForm') messageForm?: NgForm;

  isOnline: Signal<boolean> = computed(() =>
    this.presenceService.onlineUsers().includes(this.user()?.email ?? '')
  );

  constructor(
    private route: ActivatedRoute,
    public accountService: AccountService,
    private toastr: ToastrService,
    public messageService: MessageService,
    private presenceService: PresenceService
  ) {
    const email = this.route.snapshot.paramMap.get('email');
    this.email.set(email);
    if (email) {
      this.accountService.getUserByEmail(email).subscribe({
        next: (user: User) => {
          this.user.set(user);
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Error while fetching user data');
        },
      });
    }
  }

  ngOnInit(): void {
    const email = this.email();
    const currentUser = this.accountService.currentUser();
    if (email && currentUser) {
      this.loading.set(true);
      this.messageService.createHubConnection(currentUser, email);
      this.loading.set(false);
    }
  }

  sendMessage() {
    if (this.messageContent.trim() === '') {
      return;
    }

    const email = this.email();
    if (!email) {
      return;
    }

    this.loading.set(true);
    this.messageService
      .sendMessage(email, this.messageContent)
      .then(() => {
        this.messageForm?.reset();
      })
      .finally(() => this.loading.set(false));
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
