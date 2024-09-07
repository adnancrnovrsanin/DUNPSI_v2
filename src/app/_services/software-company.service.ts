import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  SoftwareCompany,
  SoftwareCompanyDto,
} from '../_models/softwareCompany';
import { HttpClient } from '@angular/common/http';
import { Project, ProjectDto } from '../_models/softwareProject';
import { CreateInitialProjectRequest } from '../_models/projectRequest';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SoftwareCompanyService {
  baseUrl = environment.apiUrl;
  currentSoftwareCompany: WritableSignal<SoftwareCompany | null> = signal(null);
  companyProjects: WritableSignal<Project[]> = signal([]);

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

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
            ...projectsDto.map((project) => ({
              ...project,
              dueDate: new Date(project.dueDate),
            })),
          ]);
        },
        error: console.log,
      });
  }

  sendInitialProjectRequest(projectRequest: CreateInitialProjectRequest) {
    return this.http
      .post<void>(
        this.baseUrl + 'softwareproject/initial-request',
        projectRequest
      )
      .subscribe({
        next: () => {
          this.toastr.success('Project request sent');
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          this.toastr.error(error);
          console.log(error);
        },
      });
  }

  clear() {
    this.currentSoftwareCompany.set(null);
    this.companyProjects.set([]);
  }
}
