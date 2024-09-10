import { Component } from '@angular/core';
import { BoardComponent } from "../../_components/board/board.component";

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [BoardComponent],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss'
})
export class ProjectPageComponent {

}
