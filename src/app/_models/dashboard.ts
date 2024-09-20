export interface ProjectDashboardDto {
  id: string;
  clientId: string;
  name: string;
  description: string;
  dueDate: string;
  status: string;
  assignedTeamId: string;
  assignedTeam: AssignedTeamDashboardDto;
  client: ClientDashboardDto;
  phases: PhaseDashboardDto[];
}

export interface AssignedTeamDashboardDto {
  id: string;
  projectManagerId: string;
  projectId: string;
  manager: ManagerDashboardDto;
  developers: DeveloperDashboardDto[];
}

export interface ManagerDashboardDto {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl: string;
  certificateUrl: string;
  yearsOfExperience: number;
  currentTeamId: string;
}

export interface DeveloperDashboardDto {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl: string;
  qualityRating: number;
  ratingCount: number;
  position: string;
  numberOfActiveTasks: number;
}

export interface ClientDashboardDto {
  id: string;
  appUserId: string;
  representativeName: string;
  representativeSurname: string;
  email: string;
  companyName: string;
  address: string;
  contact: string;
  web: string;
  currentProjects: any[];
}

export interface PhaseDashboardDto {
  id: string;
  projectId: string;
  serialNumber: number;
  name: string;
  description: string;
  requirements: RequirementDashboardDto[];
}

export interface RequirementDashboardDto {
  id: string;
  projectId: string;
  phaseId: string;
  name: string;
  description: string;
  status: string;
  serialNumber: number;
  idNumber: number;
  type: string;
  priority: number;
  estimate: number;
  createdAt: string;
  assignedDevelopers: AssignedDeveloperDashboardDto[];
}

export interface AssignedDeveloperDashboardDto {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl: string;
  qualityRating: number;
  ratingCount: number;
  position: string;
  numberOfActiveTasks: number;
}

export interface CompanyDashboardData {
  allClients: AllClients[];
  allProjects: AllProject[];
  allProjectManagers: AllProjectManager[];
  allDevelopers: AllDeveloper[];
}

export interface AllClients {
  id: string;
  appUserId: string;
  representativeName: string;
  representativeSurname: string;
  email: string;
  companyName: string;
  address: string;
  contact: string;
  web: string;
  currentProjects: CurrentProject[];
}

export interface CurrentProject {
  id: string;
  clientId: string;
  name: string;
  description: string;
  dueDate: string;
  status: string;
  assignedTeamId: string;
  assignedTeam: AssignedTeam;
}

export interface AssignedTeam {
  id: string;
  projectManagerId: string;
  projectId: string;
  manager: Manager;
  developers: Developer[];
}

export interface Manager {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl: any;
  certificateUrl: string;
  yearsOfExperience: number;
  currentTeamId: string;
}

export interface Developer {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl: any;
  qualityRating: number;
  ratingCount: number;
  position: string;
  numberOfActiveTasks: number;
}

export interface AllProject {
  id: string;
  clientId: string;
  name: string;
  description: string;
  dueDate: string;
  status: string;
  assignedTeamId: string;
  assignedTeam: AssignedTeam2;
  client: Client;
  phases: Phase[];
}

export interface AssignedTeam2 {
  id: string;
  projectManagerId: string;
  projectId: string;
  manager: Manager2;
  developers: Developer2[];
}

export interface Manager2 {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl: any;
  certificateUrl: string;
  yearsOfExperience: number;
  currentTeamId: string;
}

export interface Developer2 {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl: any;
  qualityRating: number;
  ratingCount: number;
  position: string;
  numberOfActiveTasks: number;
}

export interface Client {
  id: string;
  appUserId: string;
  representativeName: string;
  representativeSurname: string;
  email: string;
  companyName: string;
  address: string;
  contact: string;
  web: string;
  currentProjects: CurrentProject2[];
}

export interface CurrentProject2 {
  id: string;
  clientId: string;
  name: string;
  description: string;
  dueDate: string;
  status: string;
  assignedTeamId: string;
  assignedTeam: AssignedTeam3;
}

export interface AssignedTeam3 {
  id: string;
  projectManagerId: string;
  projectId: string;
  manager: Manager3;
  developers: Developer3[];
}

export interface Manager3 {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl: any;
  certificateUrl: string;
  yearsOfExperience: number;
  currentTeamId: string;
}

export interface Developer3 {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl: any;
  qualityRating: number;
  ratingCount: number;
  position: string;
  numberOfActiveTasks: number;
}

export interface Phase {
  id: string;
  projectId: string;
  serialNumber: number;
  name: string;
  description: string;
  requirements: Requirement[];
}

export interface Requirement {
  id: string;
  projectId: string;
  phaseId: string;
  name: string;
  description: string;
  status: string;
  serialNumber: number;
  idNumber: number;
  type: string;
  priority: number;
  estimate: number;
  createdAt: string;
  assignedDevelopers: AssignedDeveloper[];
}

export interface AssignedDeveloper {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl: any;
  qualityRating: number;
  ratingCount: number;
  position: string;
  numberOfActiveTasks: number;
}

export interface AllProjectManager {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl: any;
  certificateUrl: string;
  yearsOfExperience: number;
  currentTeamId: string;
}

export interface AllDeveloper {
  id: string;
  appUserId?: string;
  name?: string;
  surname?: string;
  email?: string;
  profileImageUrl: any;
  qualityRating: number;
  ratingCount: number;
  position: string;
  numberOfActiveTasks: number;
}
