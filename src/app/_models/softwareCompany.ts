import { Project, ProjectDto } from "./softwareProject";
import { Role, User } from "./user";

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
};

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

export interface CreateSoftwareCompany {
    appUserId: string;
    companyName: string;
    address: string;
    contact: string;
    web: string;
}

export interface CreateSoftwareCompanyCredentials {
    name: string;
    surname: string;
    email: string;
    password: string;
    companyName: string;
    address: string;
    contact: string;
    web: string;
}

export interface CreateSoftwareCompanyResponse {
    user: User;
    id: string;
    companyName: string;
    address: string;
    contact: string;
    web: string;
}