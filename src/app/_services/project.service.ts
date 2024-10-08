import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  Project,
  ProjectDto,
  ProjectStatus,
  projectStatusFromString,
} from '../_models/softwareProject';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {
  CreateProjectPhaseRequest,
  ProjectPhase,
  UpdateRequirementLayoutRequest,
} from '../_models/projectPhase';
import {
  CreateRequirementRequest,
  GetRequirementsOnHoldRequest,
  Requirement,
  RequirementDto,
} from '../_models/requirement';
import { environment } from '../../environments/environment';
import { CreateRatingRequest } from '../_models/rating';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  baseUrl = environment.apiUrl;
  selectedProject: WritableSignal<Project | null> = signal(null);
  selectedProjectPhases: WritableSignal<ProjectPhase[]> = signal([]);

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getProject(id: string) {
    return this.http
      .get<ProjectDto>(`${this.baseUrl}softwareProject/${id}`)
      .subscribe({
        next: (project: ProjectDto) => {
          this.selectedProject.set({
            ...project,
            dueDate: new Date(project.dueDate),
            status: projectStatusFromString(project.status),
          });
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error);
        },
      });
  }

  getProjectSubscription(id: string) {
    return this.http.get<ProjectDto>(this.baseUrl + 'softwareProject/' + id);
  }

  getProjectPhases(id: string) {
    return this.http
      .get<ProjectPhase[]>(
        this.baseUrl + 'softwareProject/project-phases/' + id
      )
      .subscribe({
        next: (projectPhases: ProjectPhase[]) => {
          for (let i = 0; i < projectPhases.length; i++) {
            projectPhases[i].requirements = projectPhases[i].requirements.sort(
              (a, b) => a.serialNumber - b.serialNumber
            );
          }
          this.selectedProjectPhases.set(
            projectPhases
              .filter(
                (pp) =>
                  !this.selectedProjectPhases().some((spp) => spp.id === pp.id)
              )
              .sort((a, b) => a.serialNumber - b.serialNumber)
          );
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error);
        },
      });
  }

  createRequirement(request: CreateRequirementRequest) {
    return this.http.post(this.baseUrl + 'requirements', request);
  }

  updateRequirementLayout(request: UpdateRequirementLayoutRequest) {
    for (let i = 0; i < request.projectPhases.length; i++) {
      const projectPhase = request.projectPhases[i];
      for (let j = 0; j < projectPhase.requirements.length; j++) {
        const requirement = projectPhase.requirements[j];
        requirement.serialNumber = j;
      }
    }
    return this.http
      .put<void>(
        this.baseUrl + 'softwareProject/project-phases/requirement-layout',
        request
      )
      .subscribe({
        next: () => {
          this.toastr.success('Requirement layout updated successfully');
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error);
        },
      });
  }

  canItBeFinished() {
    let canItBeFinished = true;
    for (let phase in this.selectedProjectPhases()) {
      if (
        this.selectedProjectPhases()[phase].requirements.length > 0 &&
        this.selectedProjectPhases()[phase].name !== 'Done'
      ) {
        canItBeFinished = false;
        break;
      }
    }
    return canItBeFinished;
  }

  getRequirementsByStatus(status: string) {
    return this.http.get<RequirementDto[]>(
      this.baseUrl + 'requirements/' + status
    );
  }

  getRequirementsOnHold(request: GetRequirementsOnHoldRequest) {
    if (!this.selectedProject) return;
    return this.http.post<RequirementDto[]>(
      this.baseUrl +
        'softwareProject/requirements/' +
        this.selectedProject()?.id,
      request
    );
  }

  updateRequirementStatus(requirementId: string, status: string) {
    return this.http.put<void>(
      this.baseUrl + 'requirements/' + requirementId + '/status/' + status,
      null
    );
  }

  assignDevelopersToRequirement(requirement: Requirement) {
    return this.http.put<void>(
      this.baseUrl + 'requirements/developer-assignment',
      requirement
    );
  }

  updateRequirement(requirement: Requirement) {
    return this.http.put<void>(this.baseUrl + 'requirements', requirement);
  }

  getUnratedRequirements(projectId: string) {
    return this.http.get<RequirementDto[]>(
      this.baseUrl + `requirements/project/${projectId}/unrated`
    );
  }

  rateRequirement(rating: CreateRatingRequest) {
    return this.http.post<void>(this.baseUrl + 'rating', rating);
  }

  createProjectPhase(projectPhase: CreateProjectPhaseRequest) {
    return this.http.post<void>(this.baseUrl + 'projectPhases', projectPhase);
  }

  deleteProjectPhase(projectPhaseId: string) {
    return this.http.delete<void>(
      this.baseUrl + 'projectPhases/' + projectPhaseId
    );
  }

  requestClientInput(projectId: string) {
    const selectedProject = this.selectedProject();
    if (!selectedProject || selectedProject.id !== projectId) return;
    return this.http.put<void>(this.baseUrl + 'softwareProject', {
      ...selectedProject,
      status: ProjectStatus.WAITING_CLIENT_INPUT,
    });
  }

  completeProject(projectId: string) {
    const selectedProject = this.selectedProject();
    if (!selectedProject || selectedProject.id !== projectId) return;
    return this.http.put<void>(this.baseUrl + 'softwareProject', {
      ...selectedProject,
      status: ProjectStatus.COMPLETED,
    });
  }

  clear() {
    this.selectedProject.set(null);
    this.selectedProjectPhases.set([]);
  }
}
