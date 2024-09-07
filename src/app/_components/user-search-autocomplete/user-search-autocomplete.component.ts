import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../_models/user';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-user-search-autocomplete',
  standalone: true,
  imports: [FormsModule, AvatarComponent],
  templateUrl: './user-search-autocomplete.component.html',
  styleUrl: './user-search-autocomplete.component.scss',
  outputs: ['selectedUserChange'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSearchAutocompleteComponent implements OnInit, OnDestroy {
  @Input() users: User[] = [];
  @Input() label: string = 'Search for a user';
  @Input() placeholder: string = 'Search for a user';

  @Output() selectedUserChange = new EventEmitter<User>();

  @ViewChild('dropdown') dropdown: ElementRef | undefined;

  query: string = '';
  filterFlag: WritableSignal<boolean> = signal(false);
  filteredUsers: WritableSignal<User[]> = signal([]);
  selectedUser: WritableSignal<User | null> = signal(null);

  ngOnInit(): void {
    this.filteredUsers.set(this.users);
  }

  filter() {
    if (this.filterFlag() || this.query.trim() === '') return;
    this.filterFlag.set(true);
    setTimeout(() => {
      this.filteredUsers.set(
        this.users.filter(
          (user) =>
            user.name.toLowerCase().includes(this.query.trim().toLowerCase()) ||
            user.surname
              .toLowerCase()
              .includes(this.query.trim().toLowerCase()) ||
            user.email.toLowerCase().includes(this.query.trim().toLowerCase())
        )
      );
      this.dropdown?.nativeElement.classList.remove('hidden');
      this.filterFlag.set(false);
    }, 200);
  }

  selectUser(user: User) {
    this.selectedUser.set(user);
    this.selectedUserChange.emit(user);
    this.dropdown?.nativeElement.classList.add('hidden');
    this.query = '';
  }

  deselectUser() {
    this.selectedUser.set(null);
    this.selectedUserChange.emit(undefined);
    this.dropdown?.nativeElement.classList.add('hidden');
    this.query = '';
  }

  ngOnDestroy(): void {
    this.filterFlag.set(false);
    this.filteredUsers.set([]);
    this.selectedUser.set(null);
    this.query = '';
  }

  openDropdown() {
    this.filteredUsers.set(this.users);
    this.dropdown?.nativeElement.classList.remove('hidden');
  }
}
