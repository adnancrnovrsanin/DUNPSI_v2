import { Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Developer, ProductManager, ProjectManager } from '../_models/profiles';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from './project.service';
import { ToastrService } from 'ngx-toastr';
import { Role, User } from '../_models/user';
import {
  ProjectDto,
  projectStatusFromString,
} from '../_models/softwareProject';
import { Subscription } from 'rxjs';
import { ProjectsService } from './projects.service';
import { TeamService } from './team.service';
import { Message } from '../_models/message';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  baseUrl = environment.apiUrl;
  currentDeveloper: WritableSignal<Developer | null> = signal(null);
  currentProductManager: WritableSignal<ProductManager | null> = signal(null);
  currentProjectManager: WritableSignal<ProjectManager | null> = signal(null);

  constructor(
    private http: HttpClient,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private projectsService: ProjectsService,
    private teamService: TeamService
  ) {}

  getDeveloper(userId: string) {
    return this.http.get<Developer>(this.baseUrl + 'developer/' + userId);
  }

  getProductManager(userId: string) {
    return this.http.get<ProductManager>(
      this.baseUrl + 'productmanager/' + userId
    );
  }

  getProjectManager(userId: string) {
    return this.http.get<ProjectManager>(
      this.baseUrl + 'projectmanager/' + userId
    );
  }

  getSoftwareCompany(userId: string) {
    return this.http.get(this.baseUrl + 'softwarecompany/' + userId);
  }

  setCurrentDeveloper(developer: Developer) {
    this.currentDeveloper.set(developer);
  }

  setCurrentProductManager(productManager: ProductManager) {
    this.currentProductManager.set(productManager);
  }

  setCurrentProjectManager(projectManager: ProjectManager) {
    this.currentProjectManager.set(projectManager);
  }

  getProfile(user: User) {
    const roleActionMap: Partial<Record<Role, (id: string) => Subscription>> = {
      [Role.DEVELOPER]: (id: string) =>
        this.getDeveloper(id).subscribe((developer) => {
          this.setCurrentDeveloper(developer);
          this.getCurrentProject(
            `${this.baseUrl}developer/current-project/${developer.id}`
          );
        }),
      [Role.PRODUCT_MANAGER]: (id: string) =>
        this.getProductManager(id).subscribe((productManager) => {
          this.setCurrentProductManager(productManager);
        }),
      [Role.PROJECT_MANAGER]: (id: string) =>
        this.getProjectManager(id).subscribe((projectManager) => {
          this.setCurrentProjectManager(projectManager);
          this.getCurrentProject(
            `${this.baseUrl}projectmanager/current-project/${projectManager.id}`
          );
          this.projectsService.getManagerProjectRequests(projectManager.id);
          if (projectManager.currentTeamId) {
            this.teamService.getTeam(projectManager.currentTeamId);
          }
        }),
    };

    // Check if the user's role is in the map before invoking the function
    const action = roleActionMap[user.role];
    if (action) {
      action(user.id);
    } else {
      console.warn(`No action defined for role: ${user.role}`);
      // Handle or ignore undefined roles here
    }
  }

  logout() {
    this.currentDeveloper.set(null);
    this.currentProductManager.set(null);
    this.currentProjectManager.set(null);
  }

  getCurrentProject(url: string) {
    this.http.get<ProjectDto | null>(url).subscribe({
      next: (project) => {
        if (!project) return;
        this.projectService.selectedProject.set({
          ...project,
          dueDate: new Date(project.dueDate),
          status: projectStatusFromString(project.status),
        });
      },
      error: (err) => this.toastr.error(err.error),
    });
  }

  getUserFromProjectManager(
    projectManager: ProjectManager | null | undefined
  ): User {
    if (!projectManager) {
      return {
        id: '',
        email: '',
        name: '',
        surname: '',
        profileImageUrl: null,
        role: Role.PROJECT_MANAGER,
        photos: [],
        token: '',
      };
    }
    return {
      id: projectManager.appUserId,
      email: projectManager.email,
      name: projectManager.name,
      surname: projectManager.surname,
      profileImageUrl: projectManager.profileImageUrl ?? null,
      role: Role.PROJECT_MANAGER,
      photos: [],
      token: '',
    };
  }

  getUserFromDeveloper(developer: Developer | null): User {
    if (!developer) {
      return {
        id: '',
        email: '',
        name: '',
        surname: '',
        profileImageUrl: null,
        role: Role.DEVELOPER,
        photos: [],
        token: '',
      };
    }
    return {
      id: developer.appUserId,
      email: developer.email,
      name: developer.name,
      surname: developer.surname,
      profileImageUrl: developer.profileImageUrl ?? null,
      role: Role.DEVELOPER,
      photos: [],
      token: '',
    };
  }

  getUserFromRecipient(message: Message): User {
    return {
      id: message.recipientId.toString(),
      email: message.recipientEmail,
      name: '',
      surname: '',
      role: Role.SOFTWARE_COMPANY,
      profileImageUrl: message.recipientPhotoUrl,
      photos: [],
      token: '',
    };
  }

  getUserFromSender(message: Message): User {
    return {
      id: message.senderId.toString(),
      email: message.senderEmail,
      name: '',
      surname: '',
      role: Role.SOFTWARE_COMPANY,
      profileImageUrl: message.senderPhotoUrl,
      photos: [],
      token: '',
    };
  }
}
