import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  InitialProjectRequest,
  InitialProjectRequestDto,
} from '../_models/projectRequest';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ProjectManager } from '../_models/profiles';
import {
  ProjectCreateDto,
  ProjectDto,
  ProjectStatus,
  projectStatusFromString,
} from '../_models/softwareProject';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  baseUrl = environment.apiUrl;
  projectRequests: WritableSignal<InitialProjectRequest[]> = signal([]);
  selectedProjectRequest: InitialProjectRequest | null = null;
  projectManagers: ProjectManager[] = [];

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  getAllActiveProjects() {
    return this.http.get<ProjectDto[]>(this.baseUrl + 'softwareProject/active');
  }

  getProjectRequests() {
    return this.http
      .get<InitialProjectRequestDto[]>(
        this.baseUrl + 'softwareproject/project-requests'
      )
      .subscribe({
        next: (response) => {
          this.projectRequests.set(
            response.map((projectRequest) => {
              return {
                ...projectRequest,
                dueDate: new Date(projectRequest.dueDate),
                client: {
                  ...projectRequest.client,
                  currentProjects: projectRequest.client.currentProjects.map(
                    (project) => {
                      return {
                        ...project,
                        dueDate: new Date(project.dueDate),
                        status: projectStatusFromString(project.status),
                      };
                    }
                  ),
                },
              };
            })
          );
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error);
        },
      });
  }

  getManagerProjectRequests(managerId: string) {
    return this.http
      .get<InitialProjectRequestDto[]>(
        this.baseUrl + 'softwareproject/manager-requests/' + managerId
      )
      .subscribe({
        next: (response) => {
          this.projectRequests.set(
            response.map((requests) => ({
              ...requests,
              dueDate: new Date(requests.dueDate),
              client: {
                ...requests.client,
                currentProjects: requests.client.currentProjects.map(
                  (project) => {
                    return {
                      ...project,
                      dueDate: new Date(project.dueDate),
                      status: projectStatusFromString(project.status),
                    };
                  }
                ),
              },
            }))
          );
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error);
        },
      });
  }

  getProjectRequest(id: string) {
    const projectRequest = this.projectRequests().find((x) => x.id === id);

    if (projectRequest) {
      this.selectedProjectRequest = projectRequest;
      return of(projectRequest).subscribe();
    }

    return this.http
      .get<InitialProjectRequestDto>(
        this.baseUrl + 'softwareproject/project-requests/' + id
      )
      .subscribe({
        next: (response) => {
          this.selectedProjectRequest = {
            ...response,
            dueDate: new Date(response.dueDate),
            client: {
              ...response.client,
              currentProjects: response.client.currentProjects.map(
                (project) => {
                  return {
                    ...project,
                    dueDate: new Date(project.dueDate),
                    status: projectStatusFromString(project.status),
                  };
                }
              ),
            },
          };
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error);
        },
      });
  }

  getfreeProjectManagersForProject() {
    return this.http
      .get<ProjectManager[]>(
        this.baseUrl + 'projectManager/free-project-managers/'
      )
      .subscribe({
        next: (response) => {
          this.projectManagers = response;
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error);
        },
      });
  }

  requestManagerForProject(request: InitialProjectRequest) {
    return this.http
      .post<void>(this.baseUrl + 'softwareproject/request-manager', request)
      .subscribe({
        next: () => {
          this.projectRequests().filter((x) => x.id !== request.id);
          this.toastr.success('Manager requested successfully');
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error);
        },
      });
  }

  createProjectRequest(projectCreateDto: ProjectCreateDto) {
    return this.http
      .post<void>(this.baseUrl + 'softwareProject', projectCreateDto)
      .subscribe({
        next: () => {
          this.projectRequests().filter(
            (x) => x.id !== projectCreateDto.projectRequestId
          );
          this.toastr.success('Project created successfully');
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error);
        },
      });
  }

  rejectManagerRequest(projectRequest: InitialProjectRequest) {
    return this.http
      .put<void>(
        this.baseUrl + 'softwareProject/manager-requests/reject',
        projectRequest
      )
      .subscribe({
        next: () => {
          this.projectRequests().filter((x) => x.id !== projectRequest.id);
          this.toastr.success('Request rejected successfully');
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error);
        },
      });
  }

  rejectProjectRequest(projectRequestId: string) {
    return this.http
      .put<void>(
        this.baseUrl + 'softwareProject/reject-request/' + projectRequestId,
        {}
      )
      .subscribe({
        next: () => {
          this.projectRequests().filter((x) => x.id !== projectRequestId);
          this.toastr.success('Project rejected successfully');
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error);
        },
      });
  }

  getCompanyProjectHistory() {
    return this.http.get<ProjectDto[]>(
      this.baseUrl + 'softwareProject/project-history'
    );
  }

  getManagerProjectHistory(managerId: string) {
    return this.http.get<ProjectDto[]>(
      this.baseUrl + 'projectManager/project-history/' + managerId
    );
  }

  clear() {
    this.projectRequests.set([]);
    this.selectedProjectRequest = null;
    this.projectManagers = [];
  }
}
