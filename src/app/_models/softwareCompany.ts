import { Project, ProjectDto } from './softwareProject';
import { CreateUserDto, Role, User } from './user';

export interface SoftwareCompany {
  id: string;
  appUserId: string;
  representativeName: string;
  representativeSurname: string;
  email: string;
  companyName: string;
  address: string;
  contact: string;
  web: string;
  currentProjects: Project[];
}

export interface SoftwareCompanyDto {
  id: string;
  appUserId: string;
  representativeName: string;
  representativeSurname: string;
  email: string;
  companyName: string;
  address: string;
  contact: string;
  web: string;
  currentProjects: ProjectDto[];
}

export interface CreateSoftwareCompanyCredentials {
  user: CreateUserDto;
  companyName: string;
  address: string;
  contact: string;
  web: string;
}

export interface CreateSoftwareCompanyResponse {
  id: string;
  companyName: string;
  address: string;
  contact: string;
  web: string;
  user: User;
}
