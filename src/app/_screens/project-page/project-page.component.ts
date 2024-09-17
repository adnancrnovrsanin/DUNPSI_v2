import { Component, OnInit } from '@angular/core';
import { BoardComponent } from '../../_components/board/board.component';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [BoardComponent],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss',
})
export class ProjectPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    initFlowbite();
  }
}
