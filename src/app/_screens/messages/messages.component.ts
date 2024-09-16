import {
  Component,
  computed,
  ElementRef,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Message } from '../../_models/message';
import { Pagination } from '../../_models/pagination';
import { MessageService } from '../../_services/message.service';
import { AsyncPipe, NgClass, TitleCasePipe } from '@angular/common';
import { TimeAgoPipe } from '../../_pipes/time-ago.pipe';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { radixPlus, radixTrash } from '@ng-icons/radix-icons';
import { AccountService } from '../../_services/account.service';
import { Role, User } from '../../_models/user';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AvatarComponent } from '../../_components/avatar/avatar.component';
import { UserSearchAutocompleteComponent } from '../../_components/user-search-autocomplete/user-search-autocomplete.component';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../_services/profile.service';
import { Modal } from 'flowbite';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    NgClass,
    TitleCasePipe,
    TimeAgoPipe,
    NgIconComponent,
    FormsModule,
    ReactiveFormsModule,
    AvatarComponent,
    UserSearchAutocompleteComponent,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
  viewProviders: [provideIcons({ radixPlus, radixTrash })],
})
export class MessagesComponent implements OnInit {
  messages: WritableSignal<Message[]> = signal([]);
  pagination: WritableSignal<Pagination | null> = signal(null);
  container: WritableSignal<string> = signal('Unread');
  pageNumber: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(5);
  loading: WritableSignal<boolean> = signal(false);
  users: WritableSignal<User[]> = signal([]);
  numbersForPagination: Signal<number[]> = computed(() => {
    const pagination = this.pagination();
    if (!pagination) {
      return [];
    }
    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;
    const maxNumbers = 2;
    const startPage = Math.max(currentPage - maxNumbers, 1);
    const endPage = Math.min(currentPage + maxNumbers, totalPages);
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  });

  newMessageForm = new FormGroup({
    recipientEmail: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    content: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
  });

  get recipientEmail(): string {
    return this.newMessageForm.get('recipientEmail')?.value ?? '';
  }

  get content(): string {
    return this.newMessageForm.get('content')?.value ?? '';
  }

  get showingFrom(): number {
    return this.pageSize() * (this.pageNumber() - 1) + 1;
  }

  get showingTo(): number {
    return this.pageSize() * this.pageNumber();
  }

  get totalItems(): number {
    return this.pagination()?.totalItems ?? 0;
  }

  constructor(
    private messageService: MessageService,
    private accountService: AccountService,
    private toastr: ToastrService,
    public profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMessages();
    this.loadAllUsers();
  }

  selectedUserChanged($event: User | undefined) {
    if (!$event) {
      this.newMessageForm.controls['recipientEmail'].setValue('');
      return;
    }
    this.newMessageForm.controls['recipientEmail'].setValue($event.email);
  }

  previousPage() {
    const pagination = this.pagination();
    if (!pagination) {
      return;
    }
    this.pageNumber.set(pagination.currentPage - 1);
    this.loadMessages();
  }
  nextPage() {
    const pagination = this.pagination();
    if (!pagination) {
      return;
    }
    this.pageNumber.set(pagination.currentPage + 1);
    this.loadMessages();
  }

  loadMessages() {
    this.loading.set(true);
    this.messageService
      .getMessages(this.pageNumber(), this.pageSize(), this.container())
      .subscribe((response) => {
        this.messages.set(response.result ?? []);
        this.pagination.set(response.pagination ?? null);
        this.loading.set(false);
      });
  }

  loadAllUsers() {
    this.accountService.getAllUsers().subscribe((users) => {
      console.log(users);
      this.users.set(
        users.filter(
          (u) => u.email !== this.accountService.currentUser()?.email
        )
      );
    });
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.messages.update((messages) =>
          messages?.splice(
            messages.findIndex((m) => m.id === id),
            1
          )
        );
        this.toastr.success('Message deleted');
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Error deleting message ' + error);
      },
    });
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }

  setContainer(containerName: string) {
    this.container.set(containerName);
    this.loadMessages();
  }

  sendMessage() {
    if (this.loading()) return;
    console.log('sending message');
    this.loading.set(true);
    if (this.newMessageForm.invalid) {
      this.loading.set(false);
      return;
    }
    if (this.recipientEmail.trim() === '') {
      this.loading.set(false);
      return;
    }
    if (this.content.trim() === '') {
      this.loading.set(false);
      return;
    }
    const user = this.accountService.currentUser();
    if (!user || user === null || user.email === this.recipientEmail) {
      this.loading.set(false);
      return;
    }
    const modalEl = document.getElementById('crud-modal');
    if (modalEl) {
      const modal = new Modal(modalEl);
      modal.hide();
    }
    this.messageService
      .sendMessageRest(this.recipientEmail, this.content)
      .subscribe({
        next: (message) => {
          this.messages.update((messages) => [...messages, message]);
          this.loading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.loading.set(false);
        },
      });
    this.loading.set(false);
  }

  openChat(message: Message) {
    if (this.container() === 'Outbox') {
      this.router.navigate(['/messages', message.recipientEmail]);
    } else {
      this.router.navigate(['/messages', message.senderEmail]);
    }
  }
}
