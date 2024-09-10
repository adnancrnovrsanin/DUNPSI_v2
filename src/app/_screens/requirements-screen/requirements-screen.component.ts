import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import {
  GetRequirementsOnHoldRequest,
  Requirement,
} from '../../_models/requirement';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../_services/project.service';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requirements-screen',
  standalone: true,
  imports: [],
  templateUrl: './requirements-screen.component.html',
  styleUrl: './requirements-screen.component.scss',
})
export class RequirementsScreenComponent implements OnInit {
  requirements: WritableSignal<Requirement[]> = signal([]);
  selectedRequirement: WritableSignal<Requirement | null> = signal(null);

  editForm = new FormGroup({
    name: new FormControl(this.selectedRequirement()?.name ?? '', [
      Validators.required,
    ]),
    description: new FormControl(
      this.selectedRequirement()?.description ?? '',
      [Validators.required]
    ),
  });

  get name() {
    return this.editForm.get('name');
  }
  get description() {
    return this.editForm.get('description');
  }

  constructor(
    private projectService: ProjectService,
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const user = this.accountService.currentUser();
    const selectedProject = this.projectService.selectedProject();

    if (!user || !selectedProject) return;

    const request: GetRequirementsOnHoldRequest = {
      projectId: selectedProject.id ?? '',
      status: user.role === 'SOFTWARE_COMPANY' ? 'PENDING' : 'CHANGES_REQUIRED',
    };

    this.projectService.getRequirementsOnHold(request)?.subscribe({
      next: (requirements: Requirement[]) => {
        this.requirements.set(requirements);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  updateRequirementStatus(requirementId: string, status: string) {
    const selectedProject = this.projectService.selectedProject();
    if (!selectedProject) return;
    this.projectService
      .updateRequirementStatus(requirementId, status)
      .subscribe({
        next: () => {
          this.requirements.update((req) =>
            req.filter((r) => r.id !== requirementId)
          );
          this.toastr.success('Requirement status updated successfully');
          this.router.navigateByUrl('/projects/' + selectedProject.id);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  updateRequirement() {
    const selectedRequirement = this.selectedRequirement();
    if (!selectedRequirement) return;
    selectedRequirement.name = this.name?.value ?? selectedRequirement.name;
    selectedRequirement.description =
      this.description?.value ?? selectedRequirement.description;
    this.projectService.updateRequirement(selectedRequirement).subscribe({
      next: () => {
        this.selectedRequirement.set(null);
        this.requirements.update((req) =>
          req.filter((r) => r.id !== selectedRequirement.id)
        );
        this.toastr.success('Requirement updated successfully');
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
