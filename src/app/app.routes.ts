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
import { ClientProjectsComponent } from './_screens/client-projects/client-projects.component';
import { ProjectPageComponent } from './_screens/project-page/project-page.component';
import { TeamComponent } from './_screens/team/team.component';
import { RequirementsScreenComponent } from './_screens/requirements-screen/requirements-screen.component';
import { ClientRegisterComponent } from './_screens/client-register/client-register.component';
import { CompanyProjectsComponent } from './_screens/company-projects/company-projects.component';
import { ChatPageComponent } from './_screens/chat-page/chat-page.component';
import { ImagesScreenComponent } from './_screens/images-screen/images-screen.component';
import { ManagerProjectHistoryComponent } from './_screens/manager-project-history/manager-project-history.component';
import { ProjectHistoryComponent } from './_screens/project-history/project-history.component';
import { ClientProjectsActionNeededComponent } from './_screens/client-projects-action-needed/client-projects-action-needed.component';
import { AdminUsersComponent } from './_screens/admin-users/admin-users.component';
import { AdminCreateDevelopersComponent } from './_screens/admin-create-developers/admin-create-developers.component';
import { AdminCreateProjectManagersComponent } from './_screens/admin-create-project-managers/admin-create-project-managers.component';
import { AdminCreateProductManagersComponent } from './_screens/admin-create-product-managers/admin-create-product-managers.component';
import { UnratedRequirementsComponent } from './_screens/unrated-requirements/unrated-requirements.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: ClientRegisterComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    component: AppWrapperComponent,
    children: [
      { path: 'dashboard/:id', component: DashboardComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'messages/:email', component: ChatPageComponent },
      { path: 'projects', component: ClientProjectsComponent },
      {
        path: 'client/project/action-needed',
        component: ClientProjectsActionNeededComponent,
      },
      { path: 'company/projects', component: CompanyProjectsComponent },
      {
        path: 'requirements/unrated',
        component: UnratedRequirementsComponent,
      },
      {
        path: 'requirements',
        component: RequirementsScreenComponent,
      },
      { path: 'projects/requests', component: ProjectsRequestsComponent },
      {
        path: 'projects/requests/:id',
        component: ProjectRequestDetailsComponent,
        resolve: projectRequestDetailedResolver,
      },
      {
        path: 'projects/history',
        component: ProjectHistoryComponent,
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
      {
        path: 'projects/manager/history/:id',
        component: ManagerProjectHistoryComponent,
      },
      { path: 'projects/:id', component: ProjectPageComponent },
      { path: 'teams/:id', component: TeamComponent },
      { path: 'images/:id', component: ImagesScreenComponent },
      { path: 'admin/users', component: AdminUsersComponent },
      {
        path: 'admin/create/developers',
        component: AdminCreateDevelopersComponent,
      },
      {
        path: 'admin/create/project-managers',
        component: AdminCreateProjectManagersComponent,
      },
      {
        path: 'admin/create/product-managers',
        component: AdminCreateProductManagersComponent,
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];
