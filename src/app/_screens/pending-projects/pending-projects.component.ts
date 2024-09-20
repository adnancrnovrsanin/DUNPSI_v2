import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  InitialProjectRequest,
  InitialProjectRequestDto,
} from '../../_models/projectRequest';
import { SoftwareCompanyService } from '../../_services/software-company.service';
import { ToastrService } from 'ngx-toastr';
import { projectStatusFromString } from '../../_models/softwareProject';

@Component({
  selector: 'app-pending-projects',
  standalone: true,
  imports: [],
  templateUrl: './pending-projects.component.html',
  styleUrl: './pending-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingProjectsComponent implements OnInit {
  projectRequests: WritableSignal<InitialProjectRequest[]> = signal([]);

  constructor(
    private softwareCompanyService: SoftwareCompanyService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const company = this.softwareCompanyService.currentSoftwareCompany();
    if (company) {
      this.softwareCompanyService
        .getInitialProjectRequests(company.id)
        .subscribe({
          next: (projectRequests: InitialProjectRequestDto[]) => {
            this.projectRequests.set(
              projectRequests.map((projectRequest) => ({
                ...projectRequest,
                dueDate: new Date(projectRequest.dueDate),
                client: {
                  ...projectRequest.client,
                  currentProjects: projectRequest.client.currentProjects.map(
                    (project) => ({
                      ...project,
                      dueDate: new Date(project.dueDate),
                      status: projectStatusFromString(project.status),
                    })
                  ),
                },
              }))
            );
          },
          error: (error) => {
            console.error(error);
            this.toastr.error('Failed to load pending projects');
          },
        });
    }
  }
}
