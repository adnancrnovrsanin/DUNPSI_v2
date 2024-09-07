import { Component } from '@angular/core';
import { NavbarComponent } from '../../_components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from "../../_components/sidebar/sidebar.component";

@Component({
  selector: 'app-app-wrapper',
  standalone: true,
  imports: [NavbarComponent, RouterModule, SidebarComponent],
  templateUrl: './app-wrapper.component.html',
  styleUrl: './app-wrapper.component.scss',
})
export class AppWrapperComponent {}
