import { Component, signal, WritableSignal } from '@angular/core';
import { ProjectsService } from '../../_services/projects.service';
import { ActivatedRoute } from '@angular/router';
import { InitialProjectRequest } from '../../_models/projectRequest';
import { TeamService } from '../../_services/team.service';
import { Developer } from '../../_models/profiles';
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ProjectCreateDto, ProjectDto } from '../../_models/softwareProject';
import { AvatarComponent } from '../../_components/avatar/avatar.component';
import { Role, User } from '../../_models/user';

@Component({
  selector: 'app-project-manager-request-details',
  standalone: true,
  imports: [NgClass, AvatarComponent],
  templateUrl: './project-manager-request-details.component.html',
  styleUrl: './project-manager-request-details.component.scss',
})
export class ProjectManagerRequestDetailsComponent {
  id: string | null = null;
  freeDevelopers: WritableSignal<Developer[]> = signal([]);
  selectedDevelopers: WritableSignal<Developer[]> = signal([]);

  constructor(
    private projectsService: ProjectsService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.id) {
      this.projectsService.getProjectRequest(this.id);
      this.teamService.getFreeDevelopers().subscribe({
        next: (developers) => {
          this.freeDevelopers.set(developers);
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  get projectRequest() {
    return this.projectsService.selectedProjectRequest;
  }

  getUser(developer: Developer): User {
    return {
      id: developer.appUserId,
      email: developer.email,
      name: developer.name,
      surname: developer.surname,
      profileImageUrl: developer.profileImageUrl ?? '',
      photos: [],
      token: '',
      role: Role.DEVELOPER,
    };
  }

  addOrRemoveDeveloper(developer: Developer) {
    if (this.selectedDevelopers().includes(developer)) {
      this.selectedDevelopers.update((developers) =>
        developers.filter((d) => d.id !== developer.id)
      );
    } else {
      this.selectedDevelopers.update((developers) => [
        ...developers,
        developer,
      ]);
    }
  }

  acceptProject() {
    const request = this.projectsService.selectedProjectRequest;
    if (!request) {
      this.toastr.error('No request found');
      return;
    }
    const newRequest: ProjectCreateDto = {
      projectRequestId: request.id,
      assignedProjectManager: request.appointedManagerId,
      selectedDevelopers: this.selectedDevelopers().map((d) => d.id),
    };

    this.projectsService.createProjectRequest(newRequest);
  }

  rejectRequest(rejectionReason: string) {
    const request = this.projectRequest;
    if (this.id && request) {
      const newRequest: InitialProjectRequest = {
        ...request,
        rejectedByManager: true,
        managerRejectionReason: rejectionReason,
      };
      this.projectsService.rejectManagerRequest(newRequest);
    }
  }
}
