import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../_services/projects.service';
import { Router } from '@angular/router';
import { InitialProjectRequest } from '../../_models/projectRequest';

@Component({
  selector: 'app-projects-requests',
  standalone: true,
  imports: [],
  templateUrl: './projects-requests.component.html',
  styleUrl: './projects-requests.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsRequestsComponent implements OnInit {
  constructor(
    private projectsService: ProjectsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectsService.getProjectRequests();
  }

  get projectRequests() {
    return this.projectsService.projectRequests;
  }

  link(projectRequest: InitialProjectRequest) {
    this.router.navigate(['/projects/requests', projectRequest.id]);
  }
}
