import { Component, Input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  matBookmark,
  matBugReport,
  matCheck,
} from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-requirement-type-icon',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './requirement-type-icon.component.html',
  styleUrl: './requirement-type-icon.component.scss',
  viewProviders: [provideIcons({ matBookmark, matBugReport, matCheck })],
})
export class RequirementTypeIconComponent {
  @Input() type: string | undefined;
}
