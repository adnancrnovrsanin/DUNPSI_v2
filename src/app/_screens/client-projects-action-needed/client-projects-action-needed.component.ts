import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import {
  Project,
  projectStatusFromString,
} from '../../_models/softwareProject';
import { SoftwareCompanyService } from '../../_services/software-company.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-projects-action-needed',
  standalone: true,
  imports: [],
  templateUrl: './client-projects-action-needed.component.html',
  styleUrl: './client-projects-action-needed.component.scss',
})
export class ClientProjectsActionNeededComponent implements OnInit {
  projects: WritableSignal<Project[]> = signal([]);

  constructor(
    private softwareCompanyService: SoftwareCompanyService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.softwareCompanyService
      .getCompanyProjectsWhereActionNeeded()
      ?.subscribe({
        next: (projects) => {
          this.projects.set(
            projects.map((project) => ({
              ...project,
              dueDate: new Date(project.dueDate),
              status: projectStatusFromString(project.status),
            }))
          );
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error);
        },
      });
  }

  navigateToProject(projectId: string) {
    this.router.navigate(['/projects', projectId]);
  }
}
