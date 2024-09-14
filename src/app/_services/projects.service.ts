import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  InitialProjectRequest,
  InitialProjectRequestDto,
} from '../_models/projectRequest';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ProjectManager } from '../_models/profiles';
import { ProjectCreateDto, ProjectDto } from '../_models/softwareProject';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

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
    private router: Router,
  ) {}

  getAllProjects() {
    return this.http.get<ProjectDto[]>(this.baseUrl + 'softwareProject');
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
                id: projectRequest.id,
                projectName: projectRequest.projectName,
                projectDescription: projectRequest.projectDescription,
                dueDate: new Date(projectRequest.dueDate),
                rejected: projectRequest.rejected,
                rejectedByManager: projectRequest.rejectedByManager,
                managerRejectionReason: projectRequest.managerRejectionReason,
                appointedManagerId: projectRequest.appointedManagerId,
                appointedManagerEmail: projectRequest.appointedManagerEmail,
                clientId: projectRequest.clientId,
                client: {
                  id: projectRequest.client.id,
                  appUserId: projectRequest.client.appUserId,
                  representativeName: projectRequest.client.representativeName,
                  representativeSurname:
                    projectRequest.client.representativeSurname,
                  email: projectRequest.client.email,
                  companyName: projectRequest.client.companyName,
                  address: projectRequest.client.address,
                  contact: projectRequest.client.contact,
                  web: projectRequest.client.web,
                  currentProjects: projectRequest.client.currentProjects.map(
                    (project) => {
                      return {
                        id: project.id,
                        clientId: project.clientId,
                        name: project.name,
                        description: project.description,
                        dueDate: new Date(project.dueDate),
                        finished: project.finished,
                        assignedTeamId: project.assignedTeamId,
                        assignedTeam: project.assignedTeam,
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
              id: requests.id,
              projectName: requests.projectName,
              projectDescription: requests.projectDescription,
              dueDate: new Date(requests.dueDate),
              rejected: requests.rejected,
              rejectedByManager: requests.rejectedByManager,
              managerRejectionReason: requests.managerRejectionReason,
              appointedManagerId: requests.appointedManagerId,
              appointedManagerEmail: requests.appointedManagerEmail,
              clientId: requests.clientId,
              client: {
                id: requests.client.id,
                appUserId: requests.client.appUserId,
                representativeName: requests.client.representativeName,
                representativeSurname: requests.client.representativeSurname,
                email: requests.client.email,
                companyName: requests.client.companyName,
                address: requests.client.address,
                contact: requests.client.contact,
                web: requests.client.web,
                currentProjects: requests.client.currentProjects.map(
                  (project) => {
                    return {
                      id: project.id,
                      clientId: project.clientId,
                      name: project.name,
                      description: project.description,
                      dueDate: new Date(project.dueDate),
                      finished: project.finished,
                      assignedTeamId: project.assignedTeamId,
                      assignedTeam: project.assignedTeam,
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
            id: response.id,
            projectName: response.projectName,
            projectDescription: response.projectDescription,
            dueDate: new Date(response.dueDate),
            rejected: response.rejected,
            rejectedByManager: response.rejectedByManager,
            managerRejectionReason: response.managerRejectionReason,
            appointedManagerId: response.appointedManagerId,
            appointedManagerEmail: response.appointedManagerEmail,
            clientId: response.clientId,
            client: {
              id: response.client.id,
              appUserId: response.client.appUserId,
              representativeName: response.client.representativeName,
              representativeSurname: response.client.representativeSurname,
              email: response.client.email,
              companyName: response.client.companyName,
              address: response.client.address,
              contact: response.client.contact,
              web: response.client.web,
              currentProjects: response.client.currentProjects.map(
                (project) => {
                  return {
                    id: project.id,
                    clientId: project.clientId,
                    name: project.name,
                    description: project.description,
                    dueDate: new Date(project.dueDate),
                    finished: project.finished,
                    assignedTeamId: project.assignedTeamId,
                    assignedTeam: project.assignedTeam,
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
        this.baseUrl + 'softwareProject/reject-manager-request',
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

  getProjectHistory(managerId: string) {
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
