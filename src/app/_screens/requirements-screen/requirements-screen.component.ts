import {
  AfterContentInit,
  Component,
  computed,
  ElementRef,
  OnInit,
  Signal,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import {
  GetRequirementsOnHoldRequest,
  Requirement,
  RequirementDto,
} from '../../_models/requirement';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProjectService } from '../../_services/project.service';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Project } from '../../_models/softwareProject';
import { User } from '../../_models/user';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { TextareaInputComponent } from '../../_forms/textarea-input/textarea-input.component';
import { ProfileService } from '../../_services/profile.service';

import { initFlowbite, Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';

@Component({
  selector: 'app-requirements-screen',
  standalone: true,
  imports: [TextInputComponent, TextareaInputComponent, ReactiveFormsModule],
  templateUrl: './requirements-screen.component.html',
  styleUrl: './requirements-screen.component.scss',
})
export class RequirementsScreenComponent implements OnInit {
  requirementsForEdit: WritableSignal<Requirement[]> = signal([]);
  requirementsForApproval: WritableSignal<Requirement[]> = signal([]);
  selectedRequirement: WritableSignal<Requirement | null> = signal(null);
  loading: WritableSignal<boolean> = signal(false);

  editForm: Signal<FormGroup> = computed(() => {
    return new FormGroup({
      name: new FormControl(this.selectedRequirement()?.name ?? '', [
        Validators.required,
      ]),
      description: new FormControl(
        this.selectedRequirement()?.description ?? '',
        [Validators.required]
      ),
    });
  });

  get name() {
    return this.editForm().get('name');
  }
  get description() {
    return this.editForm().get('description');
  }

  @ViewChild('updateRequirementModal')
  updateRequirementModal: ElementRef | undefined;

  constructor(
    private projectService: ProjectService,
    public accountService: AccountService,
    private profileService: ProfileService,
    private router: Router,
    private toastr: ToastrService,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    initFlowbite();
    const user = this.accountService.currentUser();
    if (user) {
      if (user.role === 'PROJECT_MANAGER') {
        const selectedProject = this.projectService.selectedProject();
        if (!selectedProject) return;
        this.getRequirementsForProjectManager(selectedProject, user);
      } else if (user.role === 'PRODUCT_MANAGER') {
        this.getRequirementsForProductManager(user);
      }
    }
  }

  getRequirementsForProjectManager(selectedProject: Project, user: User) {
    const firstReq: GetRequirementsOnHoldRequest = {
      projectId: selectedProject.id ?? '',
      status: 'WAITING_PROJECT_MANAGER_APPROVAL',
    };

    this.projectService.getRequirementsOnHold(firstReq)?.subscribe({
      next: (requirements: RequirementDto[]) => {
        this.requirementsForApproval.set(
          requirements.map((req) => ({
            ...req,
            createdAt: new Date(req.createdAt),
          }))
        );
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    const secondReq: GetRequirementsOnHoldRequest = {
      projectId: selectedProject.id ?? '',
      status: 'WAITING_PROJECT_MANAGER_CHANGES',
    };

    this.projectService.getRequirementsOnHold(secondReq)?.subscribe({
      next: (requirements: RequirementDto[]) => {
        this.requirementsForEdit.set(
          requirements.map((req) => ({
            ...req,
            createdAt: new Date(req.createdAt),
          }))
        );
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getRequirementsForProductManager(user: User) {
    this.projectService
      .getRequirementsByStatus('WAITING_PRODUCT_MANAGER_APPROVAL')
      .subscribe({
        next: (requirements: RequirementDto[]) => {
          this.requirementsForApproval.set(
            requirements.map((req) => ({
              ...req,
              createdAt: new Date(req.createdAt),
            }))
          );
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    this.projectService
      .getRequirementsByStatus('WAITING_PRODUCT_MANAGER_CHANGES')
      .subscribe({
        next: (requirements: RequirementDto[]) => {
          this.requirementsForEdit.set(
            requirements.map((req) => ({
              ...req,
              createdAt: new Date(req.createdAt),
            }))
          );
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  updateRequirementStatus(requirementId: string, status: string) {
    const selectedProject = this.projectService.selectedProject();
    const user = this.accountService.currentUser();
    if (!user || (user.role === 'PROJECT_MANAGER' && !selectedProject)) return;
    if (status === 'CHANGES_REQUIRED')
      status =
        user.role === 'PROJECT_MANAGER'
          ? 'WAITING_PRODUCT_MANAGER_CHANGES'
          : 'WAITING_PROJECT_MANAGER_CHANGES';
    this.projectService
      .updateRequirementStatus(requirementId, status)
      .subscribe({
        next: () => {
          this.requirementsForApproval.update((req) =>
            req.filter((r) => r.id !== requirementId)
          );
          this.requirementsForEdit.update((req) =>
            req.filter((r) => r.id !== requirementId)
          );
          this.toastr.success('Requirement status updated successfully');
          if (user.role === 'PROJECT_MANAGER')
            this.router.navigateByUrl('/projects/' + selectedProject?.id);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  updateRequirement() {
    const selectedRequirement = this.selectedRequirement();
    if (!selectedRequirement) return;
    this.loading.set(true);
    selectedRequirement.name = this.name?.value ?? selectedRequirement.name;
    selectedRequirement.description =
      this.description?.value ?? selectedRequirement.description;
    this.projectService.updateRequirement(selectedRequirement).subscribe({
      next: () => {
        this.selectedRequirement.set(null);
        this.requirementsForApproval.update((req) =>
          req.filter((r) => r.id !== selectedRequirement.id)
        );
        this.requirementsForEdit.update((req) =>
          req.filter((r) => r.id !== selectedRequirement.id)
        );
        this.toastr.success('Requirement updated successfully');
        this.loading.set(false);
        this.closeModal();
      },
      error: (err: any) => {
        console.log(err);
        this.toastr.error('Failed to update requirement');
        this.loading.set(false);
      },
    });
  }

  editButtonClicked(requirement: Requirement) {
    this.selectedRequirement.set(requirement);
    const modalEl = document.getElementById('updateRequirementModal');
    if (!modalEl) return;
    const modal = new Modal(modalEl);
    modal.show();
  }

  closeModal() {
    const modalEl = document.getElementById('updateRequirementModal');
    if (!modalEl) return;
    const modal = new Modal(modalEl);
    modal.hide();
    this.selectedRequirement.set(null);
  }
}
