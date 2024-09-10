import { Component, Input, Self } from '@angular/core';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './textarea-input.component.html',
  styleUrl: './textarea-input.component.scss',
})
export class TextareaInputComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() name = '';

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {}

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
