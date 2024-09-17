import { Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
} from '@microsoft/signalr';
import { Message } from '../_models/message';
import { HttpClient } from '@angular/common/http';
import { BusyService } from './busy.service';
import { Group } from '../_models/group';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  hubUrl = environment.hubUrl;
  baseUrl = environment.apiUrl;
  private hubConnection?: HubConnection;
  messageThread: WritableSignal<Message[]> = signal([]);

  constructor(private http: HttpClient, private busyService: BusyService) {}

  createHubConnection(user: User, otherUserEmail: string) {
    this.busyService.busy();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUserEmail, {
        accessTokenFactory: () => user.token,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch((error) => console.log(error))
      .finally(() => this.busyService.idle());

    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messageThread.set(messages);
    });

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some((x) => x.username === otherUserEmail)) {
        this.messageThread.update((messages) =>
          messages.map((message) => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
            return message;
          })
        );
      }
    });

    this.hubConnection.on('NewMessage', (message) => {
      this.messageThread.update((messages) => [...messages, message]);
    });
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.messageThread.set([]);
      this.hubConnection.stop();
    }
  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(
      this.baseUrl + 'messages',
      params,
      this.http
    );
  }

  getMessageThread(email: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + email);
  }

  async sendMessage(email: string, content: string) {
    return this.hubConnection
      ?.invoke('SendMessage', { recipientEmail: email, content })
      .catch((error) => console.log(error));
  }

  sendMessageRest(email: string, content: string) {
    return this.http.post<Message>(this.baseUrl + 'messages', {
      recipientEmail: email,
      content,
    });
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }

  getCountUnreadMessages() {
    return this.http.get<number>(this.baseUrl + 'messages/unread');
  }
}
