import { Injectable } from '@angular/core';
import { DeveloperAssignmentRequest, Team } from '../_models/team';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Developer } from '../_models/profiles';
import { ProjectService } from './project.service';
import { Rating, RatingDto } from '../_models/rating';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  baseUrl = environment.apiUrl;
  selectedTeam: Team | null = null;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private projectService: ProjectService
  ) {}

  getTeam(id: string) {
    this.http.get<Team>(this.baseUrl + 'team/' + id).subscribe({
      next: (team) => {
        this.selectedTeam = team;
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error);
      },
    });
  }

  getFreeDevelopers() {
    return this.http.get<Developer[]>(
      this.baseUrl + 'developer/free-developers'
    );
  }

  getFreeDevelopersForProjectTasks(projectId: string) {
    return this.http.get<Developer[]>(
      this.baseUrl + 'developer/free-developers/' + projectId
    );
  }

  assignDevelopers(teamId: string, developers: Developer[]) {
    const request: DeveloperAssignmentRequest = {
      id: teamId,
      developers,
    };
    return this.http.post<void>(
      this.baseUrl + 'team/developer-assignment',
      request
    );
  }

  rate(rating: RatingDto) {
    return this.http.post<void>(this.baseUrl + 'rating', rating);
  }

  clear() {
    this.selectedTeam = null;
  }
}
