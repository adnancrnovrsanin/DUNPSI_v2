import { Team } from "./team";

export interface Project {
    id: string;
    clientId: string;
    name: string;
    description: string;
    dueDate: Date;
    finished: boolean;
    assignedTeamId: string;
    assignedTeam: Team;
};

export interface ProjectDto {
    id: string;
    clientId: string;
    name: string;
    description: string;
    dueDate: string;
    finished: boolean;
    assignedTeamId: string;
    assignedTeam: Team;
}

export interface ProjectCreateDto {
    projectRequestId: string;
    assignedProjectManager: string;
    selectedDevelopers: string[];
}