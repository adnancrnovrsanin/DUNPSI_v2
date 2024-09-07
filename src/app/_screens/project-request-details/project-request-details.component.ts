import { Component, signal, WritableSignal } from '@angular/core';
import { ProjectsService } from '../../_services/projects.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectCreateDto } from '../../_models/softwareProject';
import { InitialProjectRequest } from '../../_models/projectRequest';

@Component({
  selector: 'app-project-request-details',
  standalone: true,
  imports: [],
  templateUrl: './project-request-details.component.html',
  styleUrl: './project-request-details.component.scss',
})
export class ProjectRequestDetailsComponent {
  id: string | null = null;
  selectedManager: WritableSignal<string | null> = signal(null);

  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.id) {
      this.projectsService.getProjectRequest(this.id);
      this.projectsService.getfreeProjectManagersForProject();
    }
  }

  get projectRequest() {
    return this.projectsService.selectedProjectRequest;
  }

  get freeProjectManagers() {
    return this.projectsService.projectManagers;
  }

  setSelectedValue($event: any) {
    this.selectedManager.set($event.target.value);
  }

  acceptProject() {
    const selectManager = this.selectedManager();
    const request = this.projectRequest;
    if (this.id && selectManager && request) {
      const projectManagerRequest: InitialProjectRequest = {
        ...request,
        appointedManagerId: selectManager,
        appointedManagerEmail: '',
      };

      this.projectsService.requestManagerForProject(projectManagerRequest);
    }
  }

  rejectRequest() {
    if (this.id) {
      this.projectsService.rejectProjectRequest(this.id);
    }
  }
}
