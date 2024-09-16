import { Injectable, signal, WritableSignal } from '@angular/core';
import { Role, User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PresenceService } from './presence.service';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';
import { SoftwareCompanyService } from './software-company.service';
import { map } from 'rxjs';
import { ProjectsService } from './projects.service';
import { ProjectService } from './project.service';
import { TeamService } from './team.service';
import {
  CreateSoftwareCompanyCredentials,
  CreateSoftwareCompanyResponse,
  SoftwareCompanyDto,
} from '../_models/softwareCompany';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  currentUser: WritableSignal<User | null> = signal(null);

  constructor(
    private http: HttpClient,
    private presenceService: PresenceService,
    private profileService: ProfileService,
    private softwareCompanyService: SoftwareCompanyService,
    private projectsService: ProjectsService,
    private projectService: ProjectService,
    private teamService: TeamService,
    private router: Router
  ) {}

  setCurrentUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
    this.presenceService.createHubConnection(user);
    if (user.role !== Role.SOFTWARE_COMPANY)
      this.profileService.getProfile(user);
    if (user.role === Role.SOFTWARE_COMPANY)
      this.softwareCompanyService.getCompanyByEmail(user.email);
  }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
          if (user.role === Role.ADMIN) {
            this.router.navigate(['/admin/users']);
          } else {
            this.router.navigate(['/messages']);
          }
        }
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.presenceService.stopHubConnection();
    this.profileService.logout();
    this.softwareCompanyService.clear();
    this.projectsService.clear();
    this.projectService.clear();
    this.teamService.clear();
    this.router.navigate(['/']);
  }

  getAllUsers() {
    return this.http.get<User[]>(this.baseUrl + 'account/search/all');
  }

  getUser(id: string) {
    return this.http.get<User>(this.baseUrl + 'account/' + id);
  }

  getUserByEmail(email: string) {
    return this.http.get<User>(this.baseUrl + 'account/email/' + email);
  }

  searchUsers(searchText: string) {
    return this.http.get<User[]>(this.baseUrl + 'account/search/' + searchText);
  }

  setMainPhoto(photoId: number) {
    return this.http.put(
      this.baseUrl + 'photos/' + this.currentUser()?.id + '/setmain/' + photoId,
      {}
    );
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'photos/' + photoId);
  }

  createSoftwareCompany(
    softwareCompanyCreds: CreateSoftwareCompanyCredentials
  ) {
    return this.http
      .post<CreateSoftwareCompanyResponse>(
        this.baseUrl + 'softwareCompany',
        softwareCompanyCreds
      )
      .pipe(
        map((response) => {
          if (response) {
            this.setCurrentUser(response.user);

            const softwareCompany: SoftwareCompanyDto = {
              id: response.id,
              appUserId: response.user.id,
              representativeName: response.user.name,
              representativeSurname: response.user.surname,
              email: response.user.email,
              companyName: response.companyName,
              address: response.address,
              contact: response.contact,
              web: response.web,
              currentProjects: [],
            };

            this.softwareCompanyService.setCurrentSoftwareCompany(
              softwareCompany
            );
          }
        })
      );
  }
}
