import { Routes } from '@angular/router';
import { HomeComponent } from './_screens/home/home.component';
import { LoginComponent } from './_screens/login/login.component';
import { NotFoundComponent } from './_screens/not-found/not-found.component';
import { ServerErrorComponent } from './_screens/server-error/server-error.component';
import { authGuard } from './_guards/auth.guard';
import { DashboardComponent } from './_screens/dashboard/dashboard.component';
import { AppWrapperComponent } from './_layout/app-wrapper/app-wrapper.component';
import { MessagesComponent } from './_screens/messages/messages.component';
import { ProjectsRequestsComponent } from './_screens/projects-requests/projects-requests.component';
import { projectRequestDetailedResolver } from './_resolvers/project-request-detailed.resolver';
import { ProjectRequestDetailsComponent } from './_screens/project-request-details/project-request-details.component';
import { ProjectManagerRequestsComponent } from './_screens/project-manager-requests/project-manager-requests.component';
import { ProjectManagerRequestDetailsComponent } from './_screens/project-manager-request-details/project-manager-request-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    component: AppWrapperComponent,
    children: [
      { path: 'dashboard/:id', component: DashboardComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'projects/requests', component: ProjectsRequestsComponent },
      {
        path: 'projects/requests/:id',
        component: ProjectRequestDetailsComponent,
        resolve: projectRequestDetailedResolver,
      },
      {
        path: 'projects/manager/requests',
        component: ProjectManagerRequestsComponent,
      },
      {
        path: 'projects/manager/requests/:id',
        component: ProjectManagerRequestDetailsComponent,
        resolve: projectRequestDetailedResolver,
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];
