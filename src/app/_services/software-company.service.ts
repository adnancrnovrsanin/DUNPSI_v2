import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  SoftwareCompany,
  SoftwareCompanyDto,
} from '../_models/softwareCompany';
import { HttpClient } from '@angular/common/http';
import {
  Project,
  ProjectDto,
  projectStatusFromString,
} from '../_models/softwareProject';
import {
  CreateInitialProjectRequest,
  InitialProjectRequest,
  InitialProjectRequestDto,
} from '../_models/projectRequest';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SoftwareCompanyService {
  baseUrl = environment.apiUrl;
  currentSoftwareCompany: WritableSignal<SoftwareCompany | null> = signal(null);
  companyProjects: WritableSignal<Project[]> = signal([]);
  loading: WritableSignal<boolean> = signal(false);

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.getCompanyProjects();
  }

  getCompanyByEmail(email: string) {
    return this.http
      .get<SoftwareCompanyDto>(this.baseUrl + 'softwareCompany/email/' + email)
      .subscribe({
        next: (softwareCompany: SoftwareCompanyDto) => {
          if (softwareCompany) {
            this.setCurrentSoftwareCompany(softwareCompany);
          }
        },
      });
  }

  setCurrentSoftwareCompany(softwareCompany: SoftwareCompanyDto) {
    const company: SoftwareCompany = {
      ...softwareCompany,
      currentProjects: softwareCompany.currentProjects.map((project) => ({
        ...project,
        dueDate: new Date(project.dueDate),
        status: projectStatusFromString(project.status),
      })),
    };

    this.currentSoftwareCompany.set(company);
    this.getCompanyProjects();
  }

  getCompanyProjects() {
    if (!this.currentSoftwareCompany()) return;

    this.http
      .get<ProjectDto[]>(
        `${this.baseUrl}softwareCompany/projects/${
          this.currentSoftwareCompany()?.id
        }`
      )
      .subscribe({
        next: (projectsDto: ProjectDto[]) => {
          this.companyProjects.update((softwareProjects) => [
            ...softwareProjects,
            ...projectsDto
              .filter((pd) => !softwareProjects.some((sp) => sp.id === pd.id))
              .map((project) => ({
                ...project,
                dueDate: new Date(project.dueDate),
                status: projectStatusFromString(project.status),
              })),
          ]);
        },
        error: console.log,
      });
  }

  getCompanyProjectsWhereActionNeeded() {
    if (!this.currentSoftwareCompany()) return;

    return this.http.get<ProjectDto[]>(
      `${this.baseUrl}softwareCompany/projects/${
        this.currentSoftwareCompany()?.id
      }/action-needed/`
    );
  }

  sendInitialProjectRequest(projectRequest: CreateInitialProjectRequest) {
    this.loading.set(true);
    return this.http
      .post<void>(
        this.baseUrl + 'softwareproject/initial-request',
        projectRequest
      )
      .subscribe({
        next: () => {
          this.toastr.success('Project request sent');

          this.router.navigateByUrl('/');
          this.loading.set(false);
        },
        error: (error) => {
          this.toastr.error(error);
          console.log(error);
          this.loading.set(false);
        },
      });
  }

  getInitialProjectRequests(companyId: string) {
    return this.http.get<InitialProjectRequestDto[]>(
      this.baseUrl + `softwarecompany/${companyId}/requests`
    );
  }

  clear() {
    this.currentSoftwareCompany.set(null);
    this.companyProjects.set([]);
  }
}
