import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ProjectsService } from '../_services/projects.service';

export const projectRequestDetailedResolver: ResolveFn<boolean> = (route, state) => {
  const projectRequestId = route.paramMap.get("id") ?? "";
  const projectService = inject(ProjectsService);

  projectService.getProjectRequest(projectRequestId);

  return true;
};
