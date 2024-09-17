import {
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { SoftwareCompanyService } from '../../_services/software-company.service';
import { Project } from '../../_models/softwareProject';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCalendar } from '@ng-icons/lucide';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Datepicker, initFlowbite } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { TextareaInputComponent } from '../../_forms/textarea-input/textarea-input.component';
import { CreateInitialProjectRequest } from '../../_models/projectRequest';

@Component({
  selector: 'app-client-projects',
  standalone: true,
  imports: [
    NgIconComponent,
    ReactiveFormsModule,
    TextInputComponent,
    TextareaInputComponent,
  ],
  templateUrl: './client-projects.component.html',
  styleUrl: './client-projects.component.scss',
  viewProviders: [provideIcons({ lucideCalendar })],
})
export class ClientProjectsComponent implements OnInit {
  newProjectForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });
  dueDateRequiredError: WritableSignal<boolean> = signal(false);

  get name() {
    return this.newProjectForm.get('name') as FormControl;
  }

  get description() {
    return this.newProjectForm.get('description') as FormControl;
  }

  get dueDate() {
    const $datepickerEl: HTMLInputElement = document.getElementById(
      'dueDatePicker'
    ) as HTMLInputElement;
    const datepicker = new Datepicker($datepickerEl);
    return datepicker.getDate();
  }

  constructor(public softwareCompanyService: SoftwareCompanyService) {}

  ngOnInit(): void {
    initFlowbite();
  }

  link(project: Project) {}

  submitProject() {
    const name = this.name.value ?? '';
    const description = this.description.value ?? '';
    const dueDate = this.dueDate ?? null;

    if (dueDate === null) {
      this.dueDateRequiredError.set(true);
      return;
    }

    if (this.newProjectForm.invalid) {
      console.log('DEBUG errors: ', this.name.errors);
      return;
    }

    const projectRequest: CreateInitialProjectRequest = {
      projectName: name,
      projectDescription: description,
      // @ts-ignore
      dueDate: new Date(dueDate).toISOString(),
      rejected: false,
      clientId: this.softwareCompanyService.currentSoftwareCompany()?.id ?? '',
    };

    console.log('DEBUG projectRequest: ', projectRequest);
    this.softwareCompanyService.sendInitialProjectRequest(projectRequest);
  }
}
