import { ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ProjectsService } from '../../_services/projects.service';
import {
  Project,
  projectStatusFromString,
} from '../../_models/softwareProject';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-company-projects',
  standalone: true,
  imports: [],
  templateUrl: './company-projects.component.html',
  styleUrl: './company-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyProjectsComponent implements OnInit {
  projects: WritableSignal<Project[]> = signal([]);

  constructor(
    private projectsService: ProjectsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    initFlowbite();
    this.projectsService.getAllActiveProjects().subscribe({
      next: (data) => {
        this.projects.set(
          data.map((project) => ({
            ...project,
            dueDate: new Date(project.dueDate),
            status: projectStatusFromString(project.status),
          }))
        );
      },
    });
  }

  link(project: Project) {
    this.router.navigate(['projects', project.id]);
  }
}
