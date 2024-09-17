import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
} from '@microsoft/signalr';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  onlineUsers: WritableSignal<string[]> = signal([]);
  currentUser: WritableSignal<User | null> = signal(null);

  constructor(private toastr: ToastrService, private router: Router) {}

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('UserIsOnline', (email) => {
      this.toastr.info(email + ' has connected');
      this.onlineUsers.set([...this.onlineUsers(), email]);
    });

    this.hubConnection.on('UserIsOffline', (email) => {
      this.onlineUsers.set([...this.onlineUsers().filter((x) => x !== email)]);
    });

    this.hubConnection.on('GetOnlineUsers', (emails) => {
      this.onlineUsers.set(emails);
    });

    this.hubConnection.on('NewMessageReceived', ({ email, fullName }) => {
      // this.accountService.getUserByEmail(email).subscribe({
      //   next: user => {
      //     if (user) {
      //       this.currentUser = user;
      //       this.toastr.info(fullName + ' has sent you a new message! Click me to see it')
      //         .onTap
      //         .pipe(take(1))
      //         .subscribe({
      //           next: () => this.router.navigateByUrl('/dashboard/' + user.id + '?tab=Messages')
      //         })
      //     }
      //   }
      // });
      this.toastr
        .info(fullName + ' has sent you a new message! Click me to see it')
        .onTap.pipe(take(1))
        .subscribe({
          next: () =>
            this.router.navigateByUrl('/dashboard/' + email + '?tab=Messages'),
        });
    });
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch((error) => console.log(error));
  }
}
