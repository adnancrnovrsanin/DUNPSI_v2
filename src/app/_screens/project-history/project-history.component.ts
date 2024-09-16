import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ProjectsService } from '../../_services/projects.service';
import {
  Project,
  ProjectDto,
  projectStatusFromString,
} from '../../_models/softwareProject';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-history',
  standalone: true,
  imports: [],
  templateUrl: './project-history.component.html',
  styleUrl: './project-history.component.scss',
})
export class ProjectHistoryComponent implements OnInit {
  projectHistory: WritableSignal<Project[]> = signal([]);

  constructor(
    private projectsService: ProjectsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.projectsService.getCompanyProjectHistory().subscribe({
      next: (data: ProjectDto[]) => {
        this.projectHistory.set(
          data.map((p) => ({
            ...p,
            dueDate: new Date(p.dueDate),
            status: projectStatusFromString(p.status),
          }))
        );
      },
      error: (error) => {
        console.log(error);
        this.toastr.error('Failed to load project history');
      },
    });
  }
}
