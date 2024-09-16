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
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';
import { AsyncPipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { ProjectService } from '../../_services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { TeamService } from '../../_services/team.service';
import { ToastrService } from 'ngx-toastr';
import { Developer } from '../../_models/profiles';
import {
  CreateRequirementRequest,
  Requirement,
  RequirementPriority,
  RequirementType,
} from '../../_models/requirement';
import {
  CreateProjectPhaseRequest,
  ProjectPhase,
  UpdateRequirementLayoutRequest,
} from '../../_models/projectPhase';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { TextareaInputComponent } from '../../_forms/textarea-input/textarea-input.component';
import { ProfileService } from '../../_services/profile.service';
import { AvatarComponent } from '../avatar/avatar.component';
import { truncateText } from '../../_utils/textUtils';
import { RequirementPriorityComponent } from '../requirement-priority/requirement-priority.component';
import { RequirementTypeIconComponent } from '../requirement-type-icon/requirement-type-icon.component';
import { NgIconComponent } from '@ng-icons/core';
import { ProjectStatus } from '../../_models/softwareProject';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CdkDropListGroup,
    CdkDropList,
    CdkDragPlaceholder,
    ReactiveFormsModule,
    NgFor,
    CdkDrag,
    NgIf,
    AsyncPipe,
    NgStyle,
    TextInputComponent,
    TextareaInputComponent,
    AvatarComponent,
    FormsModule,
    RequirementPriorityComponent,
    RequirementTypeIconComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit, OnDestroy {
  id: WritableSignal<string | null> = signal(null);
  freeDevelopers: WritableSignal<Developer[]> = signal([]);
  editMode: WritableSignal<boolean> = signal(false);
  editPhasesMode: WritableSignal<boolean> = signal(false);
  savedProjectPhases: WritableSignal<ProjectPhase[]> = signal([]);
  selectedRequirement: WritableSignal<Requirement | null> = signal(null);
  selectedDevelopers: WritableSignal<Developer[]> = signal([]);
  loading: WritableSignal<boolean> = signal(false);

  assignedDevelopers: Signal<Developer[]> = computed(() => {
    const requirement = this.selectedRequirement();
    if (!requirement) return [];
    return requirement.assignedDevelopers;
  });

  newProjectPhaseForm = new FormGroup({
    serialNumber: new FormControl(0, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });
  createRequirementForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    requirementType: new FormControl('USER_STORY', [Validators.required]),
    requirementPriority: new FormControl(3, [Validators.required]),
  });

  get phaseSerialNumber() {
    return this.newProjectPhaseForm.get('serialNumber');
  }
  get phaseName() {
    return this.newProjectPhaseForm.get('name');
  }
  get phaseDescription() {
    return this.newProjectPhaseForm.get('description');
  }
  get requirementName() {
    return this.createRequirementForm.get('name');
  }
  get requirementDescription() {
    return this.createRequirementForm.get('description');
  }
  get requirementType() {
    return this.createRequirementForm.get('requirementType');
  }
  get requirementPriority() {
    return this.createRequirementForm.get('requirementPriority');
  }

  get requirementTypes() {
    return Object.values(RequirementType);
  }
  get priorityLevels() {
    return [1, 2, 3, 4, 5];
  }

  truncateText = truncateText;

  // Developer search
  @ViewChild('dropdown') dropdown: ElementRef | undefined;
  query: string = '';
  selectedDeveloper: WritableSignal<Developer | null> = signal(null);
  filterFlag: WritableSignal<boolean> = signal(false);
  filteredDevelopers: WritableSignal<Developer[]> = signal([]);

  filter() {
    const selectedRequirement = this.selectedRequirement();
    if (!this.filterFlag() || !selectedRequirement) return;
    this.filterFlag.set(true);
    setTimeout(() => {
      this.filteredDevelopers.set(
        this.freeDevelopers().filter(
          (developer) =>
            !selectedRequirement.assignedDevelopers.some(
              (ad) => ad.id === developer.id
            ) &&
            (developer.name
              .toLowerCase()
              .includes(this.query.trim().toLowerCase()) ||
              developer.surname
                .toLowerCase()
                .includes(this.query.trim().toLowerCase()) ||
              developer.email
                .toLowerCase()
                .includes(this.query.trim().toLowerCase()) ||
              this.query.trim() === '')
        )
      );
      this.dropdown?.nativeElement.classList.remove('hidden');
      this.filterFlag.set(false);
    }, 200);
  }

  selectDeveloper(developer: Developer) {
    this.selectedDeveloper.set(developer);
    this.dropdown?.nativeElement.classList.add('hidden');
    this.query = '';
  }

  deselectDeveloper() {
    this.selectedDeveloper.set(null);
    this.dropdown?.nativeElement.classList.add('hidden');
    this.query = '';
  }

  openDropdown() {
    const selectedRequirement = this.selectedRequirement();
    if (!selectedRequirement) return;
    this.filteredDevelopers.set(
      this.freeDevelopers().filter(
        (developer) =>
          !selectedRequirement.assignedDevelopers.some(
            (ad) => ad.id === developer.id
          )
      )
    );
    this.dropdown?.nativeElement.classList.remove('hidden');
  }

  assignSelectedDeveloperToRequirement() {
    const selectedDeveloper = this.selectedDeveloper();
    const selectedRequirement = this.selectedRequirement();
    if (!selectedDeveloper || !selectedRequirement) return;
    this.selectedDevelopers.update((developers) => [
      ...developers,
      selectedDeveloper,
    ]);
    this.deselectDeveloper();
  }

  ngOnDestroy(): void {
    this.filterFlag.set(false);
    this.filteredDevelopers.set([]);
    this.selectedDeveloper.set(null);
    this.query = '';
    this.selectedDevelopers.set([]);
    this.selectedRequirement.set(null);
  }

  onSubmitPhase() {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.loading.set(true);
    const request: CreateProjectPhaseRequest = {
      projectId: project.id ?? '',
      serialNumber: this.phaseSerialNumber?.value ?? 0,
      name: this.phaseName?.value ?? '',
      description: this.phaseDescription?.value ?? '',
    };

    this.projectService.createProjectPhase(request).subscribe({
      next: () => {
        this.projectService.getProjectPhases(
          this.projectService.selectedProject()?.id ?? ''
        );
        this.loading.set(false);
        this.router.navigate([
          '/projects',
          this.projectService.selectedProject()?.id,
        ]);
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error);
        this.loading.set(false);
      },
    });
  }

  onSubmitRequirement() {
    const user = this.accountService.currentUser();
    const id = this.id();
    if (!user || !id) return;
    this.loading.set(true);

    const createRequirementRequest: CreateRequirementRequest = {
      name: this.requirementName?.value ?? '',
      description: this.requirementDescription?.value ?? '',
      projectId: id ?? '',
      status:
        user.role === 'PROJECT_MANAGER'
          ? 'WAITING_PRODUCT_MANAGER_APPROVAL'
          : 'WAITING_PROJECT_MANAGER_APPROVAL',
      serialNumber: 0,
      type: this.requirementType?.value ?? 'USER_STORY',
      priority: this.requirementPriority?.value ?? 3,
    };

    this.projectService.createRequirement(createRequirementRequest).subscribe({
      next: () => {
        this.toastr.success('Requirement created!');
        window.location.reload();
        this.loading.set(false);
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error);
        this.loading.set(false);
      },
    });
  }

  constructor(
    public projectService: ProjectService,
    private route: ActivatedRoute,
    public accountService: AccountService,
    private teamService: TeamService,
    private toastr: ToastrService,
    private router: Router,
    public profileService: ProfileService
  ) {
    this.id.set(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    const id = this.id();
    if (id) {
      this.projectService.getProject(id);
      this.projectService.getProjectPhases(id);
      this.teamService.getFreeDevelopersForProjectTasks(id).subscribe({
        next: (developers: Developer[]) => {
          this.freeDevelopers.set(developers);
        },
        error: (error) => {
          console.log(error);
          this.toastr.error('Error getting free developers: ' + error);
        },
      });
    }
  }

  drop(event: CdkDragDrop<Requirement[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  turnOnEditMode() {
    this.editMode.set(true);
    this.savedProjectPhases.set(this.projectService.selectedProjectPhases());
  }

  cancelEditMode() {
    this.editMode.set(false);
    window.location.reload();
  }

  saveNewLayoutChanges() {
    const id = this.id();
    if (!id) return;
    const request: UpdateRequirementLayoutRequest = {
      projectId: id,
      projectPhases: this.projectService.selectedProjectPhases(),
    };
    this.projectService.updateRequirementLayout(request);
    this.editMode.set(false);
  }

  letRequirementBeClicked(requirement: Requirement) {
    const currentUser = this.accountService.currentUser();
    if (!currentUser) return false;
    if (currentUser.role === 'SOFTWARE_COMPANY') return false;
    this.selectedRequirement.set(requirement);
    return true;
  }

  developerClicked(developer: Developer) {
    if (this.selectedDevelopers().includes(developer)) {
      this.selectedDevelopers.update((developers) =>
        developers.filter((dev) => dev !== developer)
      );
    } else {
      this.selectedDevelopers.update((developers) => [
        ...developers,
        developer,
      ]);
    }
  }

  assignDevelopers() {
    const selectedRequirement = this.selectedRequirement();
    if (!selectedRequirement || !this.selectedDevelopers().length) return;
    selectedRequirement.assignedDevelopers = this.selectedDevelopers();
    this.projectService
      .assignDevelopersToRequirement(selectedRequirement)
      .subscribe({
        next: () => {
          this.selectedDevelopers.set([]);
          this.selectedRequirement.set(null);
          this.toastr.success('Developers assigned successfully');
          window.location.reload();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  assignDeveloper() {
    const selectedDeveloper = this.selectedDeveloper();
    const selectedRequirement = this.selectedRequirement();
    if (!selectedDeveloper || !selectedRequirement) return;
    this.deselectDeveloper();
    selectedRequirement.assignedDevelopers = [
      ...selectedRequirement.assignedDevelopers,
      selectedDeveloper,
    ];
    this.projectService
      .assignDevelopersToRequirement(selectedRequirement)
      .subscribe({
        next: () => {
          this.toastr.success('Developer assigned successfully');
          this.selectedRequirement.set(selectedRequirement);
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error);
        },
      });
  }

  deletePhase(projectPhaseId: string) {
    this.projectService.deleteProjectPhase(projectPhaseId).subscribe({
      next: () => {
        this.projectService.selectedProjectPhases.update((phases) =>
          phases.filter((phase) => phase.id !== projectPhaseId)
        );
        this.toastr.success('Phase deleted successfully');
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error);
      },
    });
  }

  requestClientInput() {
    const id = this.id();
    if (!id) return;
    this.projectService.requestClientInput(id)?.subscribe({
      next: () => {
        this.toastr.success('Client input requested');
        this.projectService.selectedProject.update((project) => {
          if (!project) return null;
          return { ...project, status: ProjectStatus.WAITING_CLIENT_INPUT };
        });
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error);
      },
    });
  }

  completeTheProject() {
    const id = this.id();
    if (!id) return;
    this.projectService.completeProject(id)?.subscribe({
      next: () => {
        this.toastr.success('Project completed');
        this.projectService.selectedProject.update((project) => {
          if (!project) return null;
          return { ...project, status: ProjectStatus.COMPLETED };
        });
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error);
      },
    });
  }

  getText(number: number) {
    if (number === 1) return 'developer';
    return 'developers';
  }
}
