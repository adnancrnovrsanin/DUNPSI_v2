import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Developer } from '../../_models/profiles';
import { TeamService } from '../../_services/team.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { NgFor, NgIf } from '@angular/common';
import { AvatarComponent } from '../../_components/avatar/avatar.component';
import { ProfileService } from '../../_services/profile.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, AvatarComponent, NgIconComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
  viewProviders: [provideIcons({ lucidePlus })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamComponent implements OnInit {
  id: WritableSignal<string | null> = signal(null);
  freeDevelopersList: WritableSignal<Developer[]> = signal([]);
  selectedDevelopersList: WritableSignal<Developer[]> = signal([]);
  loading: WritableSignal<boolean> = signal(false);

  query: string = '';
  filterFlag: WritableSignal<boolean> = signal(false);
  filteredDevelopers: WritableSignal<Developer[]> = signal([]);
  selectedDeveloper: WritableSignal<Developer | null> = signal(null);
  @ViewChild('dropdown') dropdown: ElementRef | undefined;
  @ViewChild('addMembersModal') addMembersModal: ElementRef | undefined;

  filter() {
    if (this.filterFlag() || this.query.trim() === '') return;
    this.filterFlag.set(true);
    setTimeout(() => {
      this.filteredDevelopers.set(
        this.freeDevelopersList().filter(
          (developer) =>
            developer.name
              .toLowerCase()
              .includes(this.query.trim().toLowerCase()) ||
            developer.surname
              .toLowerCase()
              .includes(this.query.trim().toLowerCase()) ||
            developer.email
              .toLowerCase()
              .includes(this.query.trim().toLowerCase())
        )
      );
      this.dropdown?.nativeElement.classList.remove('hidden');
      this.filterFlag.set(false);
    }, 200);
  }

  selectDeveloper(developer: Developer) {
    this.selectedDeveloper.set(developer);
    this.selectedDeveloperChange(developer);
    this.dropdown?.nativeElement.classList.add('hidden');
    this.query = '';
  }

  deselectDeveloper() {
    this.selectedDeveloper.set(null);
    this.selectedDeveloperChange(null);
    this.dropdown?.nativeElement.classList.add('hidden');
    this.query = '';
  }

  ngOnDestroy(): void {
    this.filterFlag.set(false);
    this.filteredDevelopers.set([]);
    this.selectedDeveloper.set(null);
    this.query = '';
  }

  openDropdown() {
    this.filteredDevelopers.set(this.freeDevelopersList());
    this.dropdown?.nativeElement.classList.remove('hidden');
  }

  constructor(
    public teamService: TeamService,
    private route: ActivatedRoute,
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    public profileService: ProfileService
  ) {
    this.id.set(this.route.snapshot.paramMap.get('id') ?? null);
  }

  ngOnInit(): void {
    initFlowbite();
    this.teamService.getFreeDevelopers().subscribe({
      next: (developers) => {
        this.freeDevelopersList.set(developers);
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error);
      },
    });
  }

  developerClicked(developer: Developer) {
    if (this.selectedDevelopersList().includes(developer)) {
      this.selectedDevelopersList.update((selectedDevelopers) =>
        selectedDevelopers.filter((d) => d !== developer)
      );
    } else {
      this.selectedDevelopersList.update((selectedDevelopers) => [
        ...selectedDevelopers,
        developer,
      ]);
    }
  }

  addDevelopers() {
    const id = this.id();
    if (id) {
      this.loading.set(true);
      this.teamService
        .assignDevelopers(id, this.selectedDevelopersList())
        .subscribe({
          next: () => {
            this.addMembersModal?.nativeElement.classList.add('hidden');
            this.teamService.getTeam(id ?? '');
            this.selectedDeveloper.set(null);
            this.selectedDevelopersList.set([]);
            this.freeDevelopersList.update((freeDevelopersList) =>
              freeDevelopersList.filter(
                (d) => !this.selectedDevelopersList().includes(d)
              )
            );
            this.toastr.success('Developers added to team');
            this.loading.set(false);
          },
          error: (error) => {
            console.log(error);
            this.toastr.error(error);
          },
        });
    }
  }

  checkDeveloperCount() {
    const developers = this.teamService.selectedTeam()?.developers;
    if (developers) {
      return developers.length > 0;
    }
    return false;
  }

  addSelectedDeveloperToTeam() {
    const selectedDeveloper = this.selectedDeveloper();
    if (!selectedDeveloper) return;
    this.selectedDevelopersList.update((selectedDevelopers) => [
      ...selectedDevelopers,
      selectedDeveloper,
    ]);
    this.freeDevelopersList.update((freeDevelopers) =>
      freeDevelopers.filter((developer) => developer !== selectedDeveloper)
    );
    this.selectedDeveloper.set(null);
  }

  selectedDeveloperChange($event: Developer | null) {
    this.selectedDeveloper.set($event);
  }
}
