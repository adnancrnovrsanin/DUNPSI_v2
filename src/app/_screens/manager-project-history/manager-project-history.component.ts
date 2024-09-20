import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../_services/profile.service';
import {
  Project,
  ProjectDto,
  projectStatusFromString,
} from '../../_models/softwareProject';
import { ProjectsService } from '../../_services/projects.service';
import { ToastrService } from 'ngx-toastr';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-manager-project-history',
  standalone: true,
  imports: [],
  templateUrl: './manager-project-history.component.html',
  styleUrl: './manager-project-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerProjectHistoryComponent implements OnInit {
  id: WritableSignal<string | null> = signal(null);
  projectHistory: WritableSignal<Project[]> = signal([]);

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private projectsService: ProjectsService,
    private toastr: ToastrService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      const pm = this.profileService.currentProjectManager();
      if (pm && pm.appUserId === id) {
        this.projectsService.getManagerProjectHistory(pm.id).subscribe({
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
  }

  ngOnInit(): void {
    initFlowbite();
  }
}
