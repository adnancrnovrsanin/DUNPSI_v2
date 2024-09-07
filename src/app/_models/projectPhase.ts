import { Requirement } from "./requirement";

export interface ProjectPhase {
    id: string;
    projectId: string;
    serialNumber: number;
    name: string;
    description: string;
    requirements: Requirement[];
}

export interface CreateProjectPhaseRequest {
    projectId: string;
    serialNumber: number;
    name: string;
    description: string;
}

export interface UpdateRequirementLayoutRequest {
    projectId: string;
    projectPhases: ProjectPhase[];
}