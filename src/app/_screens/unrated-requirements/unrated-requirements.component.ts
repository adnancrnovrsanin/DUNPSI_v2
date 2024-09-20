import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Requirement } from '../../_models/requirement';
import { ProjectService } from '../../_services/project.service';
import { Router } from '@angular/router';
import { initFlowbite, Modal } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import { AvatarComponent } from '../../_components/avatar/avatar.component';
import { ProfileService } from '../../_services/profile.service';
import { RequirementTypeIconComponent } from '../../_components/requirement-type-icon/requirement-type-icon.component';
import { RequirementPriorityComponent } from '../../_components/requirement-priority/requirement-priority.component';
import { truncateText } from '../../_utils/textUtils';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextareaInputComponent } from '../../_forms/textarea-input/textarea-input.component';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { CreateRatingRequest } from '../../_models/rating';

@Component({
  selector: 'app-unrated-requirements',
  standalone: true,
  imports: [
    AvatarComponent,
    RequirementTypeIconComponent,
    RequirementPriorityComponent,
    FormsModule,
    ReactiveFormsModule,
    TextareaInputComponent,
    TextInputComponent,
  ],
  templateUrl: './unrated-requirements.component.html',
  styleUrl: './unrated-requirements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnratedRequirementsComponent implements OnInit {
  requirements: WritableSignal<Requirement[]> = signal([]);
  selectedRequirement: WritableSignal<Requirement | null> = signal(null);
  loading: WritableSignal<boolean> = signal(false);

  requirementRatingForm = new FormGroup({
    rating: new FormControl(0, [Validators.required]),
    comment: new FormControl('', [Validators.required]),
  });

  get rating() {
    return this.requirementRatingForm.get('rating');
  }

  get comment() {
    return this.requirementRatingForm.get('comment');
  }

  truncateText = truncateText;

  constructor(
    private projectService: ProjectService,
    public profileService: ProfileService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    initFlowbite();
    const currentProject = this.projectService.selectedProject();
    if (currentProject) {
      this.projectService.getUnratedRequirements(currentProject.id).subscribe({
        next: (requirements) => {
          this.requirements.set(
            requirements.map((req) => ({
              ...req,
              createdAt: new Date(req.createdAt),
            }))
          );
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error);
        },
      });
    }
  }

  requirementSelected(requirement: Requirement) {
    this.selectedRequirement.set(requirement);
    const createRequirementModalElement = document.getElementById(
      'createRequirementModal'
    );

    if (createRequirementModalElement) {
      const createRequirementModal = new Modal(createRequirementModalElement);
      createRequirementModal.show();
    }
  }

  onSubmit() {
    const requirementId = this.selectedRequirement()?.id;
    const currentProjectManager = this.profileService.currentProjectManager();
    if (!requirementId || !currentProjectManager) {
      this.toastr.error('An error occurred. Please try again');
      return;
    }
    const newRequirementRating: CreateRatingRequest = {
      ratingValue: this.rating?.value ?? 0,
      comment: this.comment?.value ?? '',
      requirementId: this.selectedRequirement()?.id ?? '',
      projectManagerId: currentProjectManager.id,
    };

    this.loading.set(true);
    this.projectService.rateRequirement(newRequirementRating).subscribe({
      next: (rating) => {
        this.loading.set(false);
        this.toastr.success('Requirement rated successfully');
        this.requirements.set(
          this.requirements().filter((req) => req.id !== requirementId)
        );
        this.selectedRequirement.set(null);
      },
      error: (error) => {
        this.loading.set(false);
        console.log(error);
        this.toastr.error(error);
      },
    });
  }
}
