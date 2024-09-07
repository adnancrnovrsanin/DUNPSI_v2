import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../_services/projects.service';
import { Router } from '@angular/router';
import { InitialProjectRequest } from '../../_models/projectRequest';

@Component({
  selector: 'app-project-manager-requests',
  standalone: true,
  imports: [],
  templateUrl: './project-manager-requests.component.html',
  styleUrl: './project-manager-requests.component.scss',
})
export class ProjectManagerRequestsComponent implements OnInit {
  constructor(
    private projectsService: ProjectsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
  }

  get projectRequests() {
    return this.projectsService.projectRequests;
  }

  link(projectRequest: InitialProjectRequest) {
    this.router.navigate(['/projects/manager/requests', projectRequest.id]);
  }
}
