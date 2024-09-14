import { Component, Input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  matEquals,
  matKeyboardArrowDown,
  matKeyboardArrowUp,
  matKeyboardDoubleArrowDown,
  matKeyboardDoubleArrowUp,
} from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-requirement-priority',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './requirement-priority.component.html',
  styleUrl: './requirement-priority.component.scss',
  viewProviders: [
    provideIcons({
      matKeyboardDoubleArrowDown,
      matKeyboardArrowDown,
      matKeyboardArrowUp,
      matKeyboardDoubleArrowUp,
      matEquals,
    }),
  ],
})
export class RequirementPriorityComponent {
  @Input() priority: number | undefined;
}
