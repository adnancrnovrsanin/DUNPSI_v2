import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ProjectsService } from '../../_services/projects.service';
import { Project } from '../../_models/softwareProject';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-projects',
  standalone: true,
  imports: [],
  templateUrl: './company-projects.component.html',
  styleUrl: './company-projects.component.scss',
})
export class CompanyProjectsComponent implements OnInit {
  projects: WritableSignal<Project[]> = signal([]);

  constructor(
    private projectsService: ProjectsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectsService.getAllProjects().subscribe({
      next: (data) => {
        this.projects.set(
          data.map((project) => ({
            ...project,
            dueDate: new Date(project.dueDate),
          }))
        );
      },
    });
  }

  link(project: Project) {
    this.router.navigate(['projects', project.id]);
  }
}
