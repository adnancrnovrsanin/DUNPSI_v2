import { Component } from '@angular/core';
import { ImageService } from '../../_services/image.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  constructor(public imageService: ImageService) {}
}
