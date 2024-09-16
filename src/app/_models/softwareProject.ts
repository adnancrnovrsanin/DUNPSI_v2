import { Team } from './team';

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string;
  dueDate: Date;
  status: ProjectStatus;
  assignedTeamId: string;
  assignedTeam: Team;
}

export interface ProjectDto {
  id: string;
  clientId: string;
  name: string;
  description: string;
  dueDate: string;
  status: string;
  assignedTeamId: string;
  assignedTeam: Team;
}

export interface ProjectCreateDto {
  projectRequestId: string;
  assignedProjectManager: string;
  selectedDevelopers: string[];
}

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  WAITING_CLIENT_INPUT = 'WAITING_CLIENT_INPUT',
  COMPLETED = 'COMPLETED',
}

export const projectStatusFromString = (status: string): ProjectStatus => {
  const statusMap: { [key: string]: ProjectStatus } = {
    ACTIVE: ProjectStatus.ACTIVE,
    WAITING_CLIENT_INPUT: ProjectStatus.WAITING_CLIENT_INPUT,
    COMPLETED: ProjectStatus.COMPLETED,
  };

  return statusMap[status] || ProjectStatus.ACTIVE;
};
