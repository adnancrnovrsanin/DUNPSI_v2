import { Component, OnInit } from '@angular/core';
import { SoftwareCompanyService } from '../../_services/software-company.service';
import { Project } from '../../_models/softwareProject';

@Component({
  selector: 'app-client-projects',
  standalone: true,
  imports: [],
  templateUrl: './client-projects.component.html',
  styleUrl: './client-projects.component.scss',
})
export class ClientProjectsComponent {
  constructor(public softwareCompanyService: SoftwareCompanyService) {}

  link(project: Project) {}
}
