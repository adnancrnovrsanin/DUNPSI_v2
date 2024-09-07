import { Developer, ProjectManager } from "./profiles";

export interface Team {
    id: string;
    projectManagerId: string;
    projectId: string;
    manager: ProjectManager;
    developers: Developer[];
}

export interface DeveloperAssignmentRequest {
    id: string;
    developers: Developer[];
}